const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { convService } = require('../services');
const ApiError = require('../utils/ApiError');
const { uploadMany } = require('../libs/cloudinary');

/**
 * TODO: add report functionality
 * add areFriends field to distinguish between requests and normal conversations
 * add a readBy functionality
 */
const sendMessage = catchAsync(async (req, res) => {
  const { user, body, files } = req;

  let conv;
  if (!body.convId) {
    conv = await convService.createNewConv(user._id, body.to);
    body.convId = conv._id;
  }
  conv = await convService.findById(body.convId);
  if (!conv || conv.blockedIds.includes(user._id)) throw new ApiError(httpStatus.NOT_FOUND, 'conversation not found');

  // check type of message
  let payload;

  if (body.text && files.length) {
    const paths = files.map((file) => file.path);
    const result = await uploadMany(paths);
    const fileData = result.map((file) => ({ url: file.url, publicId: file.publicId }));
    payload = { text: body.text, fileData };
  } else if (body.text) {
    payload = { text: body.text };
  } else if (files.length) {
    const paths = files.map((file) => file.path);
    const result = await uploadMany(paths);
    const fileData = result.map((file) => ({ url: file.url, publicId: file.publicId }));
    payload = { fileData };
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'provide a text or file');
  }

  await convService.postMessage({ sender: user._id, convId: conv._id }, payload);
  res.status(201).send('successful');
});

const getMessageByConvId = catchAsync(async (req, res) => {
  const { convId } = req.params;

  const conversation = await convService.findById(convId);

  if (!conversation) throw new ApiError(httpStatus.NOT_FOUND, 'conversation not found');

  const members = await conversation.populate('members', 'avatar name username role');

  const msgs = await convService.getMsgByConvId(convId);
  if (!msgs.length) throw new ApiError(httpStatus.NOT_FOUND, 'messages not found');

  res.status(200).send({ msgs, members });
});

const getRecentConversations = catchAsync(async (req, res) => {
  // get all user conversations
  const conversations = await convService.getConvsByUserId(req.user._id);

  if (!conversations) throw new ApiError(httpStatus.NOT_FOUND, 'resource not found');

  // get messages acroos all conversations
  const convIds = conversations.map((conv) => conv._id);

  const recentConversations = await convService.getRecentConversations(convIds, req.user._id);

  const flatconv = recentConversations.map((conv) => {
    const usersprofile = conv.convData.flat();
    const readBy = conv.readBy.flat();
    const profile = usersprofile.map((p) => {
      return {
        id: p._id,
        name: p.name,
      };
    });

    return {
      id: conv._id,
      msgId: conv.msgId,
      convId: conv.conId,
      msg: conv.msg,
      sender: conv.sender,
      readBy,
      createdAt: conv.createdAt,
      unread: conv.unread,
      isDeleted: conv.isDeleted,
      profile,
      blocked: conv.blocked,
    };
  });

  res.status(200).send(flatconv);
});

const deleteMsg = catchAsync(async (req, res) => {
  const msg = await convService.markDeleted(req.params.id);

  if (msg.modifiedCount !== 1 || !msg) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'cannot delete message');

  res.status(200).send('deleted');
});

const blockConversation = catchAsync(async (req, res) => {
  const conv = await convService.blockConversation(req.params.convId, req.params.userId);

  if (!conv || !conv.blocked) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'cannot block user');

  res.status(200).send('blocked');
});

const unBlockConversation = catchAsync(async (req, res) => {
  const conv = await convService.unBlockConversation(req.params.convId, req.params.userId);

  if (!conv) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'cannot block user');

  res.status(200).send('blocked');
});

const reportMessage = catchAsync(async (req, res) => {
  const { msgId, convId, reason } = req.body;
  const report = await convService.report(req.user._id, msgId, convId, reason);

  if (!report) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'an errror occured, cannot report message');

  res.status(201).send('reported');
});

const getAReport = catchAsync(async (req, res) => {
  const report = await convService.getAReport(req.params.reportId);
  if (!report) throw new ApiError(httpStatus.NOT_FOUND, 'cannot find resource');
  res.status(200).send(report);
});

const getReports = catchAsync(async (req, res) => {
  const reports = await convService.getReports();
  if (!reports.length) throw new ApiError(httpStatus.NOT_FOUND, 'cannot find resource');
  res.status(200).send(reports);
});
module.exports = {
  sendMessage,
  getMessageByConvId,
  getRecentConversations,
  deleteMsg,
  blockConversation,
  unBlockConversation,
  reportMessage,
  getAReport,
  getReports,
};

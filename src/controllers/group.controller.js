const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');
const { uploadSingle, uploadMany } = require('../libs/cloudinary');
const { groupService } = require('../services');

const createGroup = catchAsync(async (req, res) => {
  const { file, body } = req;

  let data = {
    members: body.members || [],
    name: body.name,
  };
  data.members.push(req.user._id);

  if (file) {
    const { publicId, url } = await uploadSingle(file.path);

    // eslint-disable-next-line prefer-const
    let fileData = {};
    Object.assign(fileData, data, { logo: { publicId, url } });
    data = fileData;
  }

  const result = await groupService.initiateGroup(data);

  if (!result) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'cannot create group');

  res.status(201).send(result);
});

const getGroupById = catchAsync(async (req, res) => {
  const group = await groupService.findGroupById(req.params.id);
  if (!group) throw new ApiError(httpStatus.NOT_FOUND, 'resource not found');

  res.status(200).send(group);
});

const getGroupByName = catchAsync(async (req, res) => {
  const group = await groupService.findGroupByName(req.params.name, req.user._id);
  if (!group) throw new ApiError(httpStatus.NOT_FOUND, 'resource not found');

  res.status(200).send(group);
});

const uploadLogo = catchAsync(async (req, res) => {
  if (!req.file) throw new ApiError(httpStatus.BAD_REQUEST, 'upload a valid image');
  const { publicId, url } = await uploadSingle(req.file.path);

  const group = await groupService.updateGroupById(req.params.groupId, { logo: { url, publicId } });

  if (!group) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'cannot update document');

  res.status(200).send('updated');
});

const deleteGroup = catchAsync(async (req, res) => {
  await groupService.deleteGroup(req.params.groupId);
  res.status(200).send('deleted');
});

const sendMessage = catchAsync(async (req, res) => {
  const { groupId, text } = req.body;
  const { user, files } = req;

  let message;
  if (text && files.length) {
    const filePaths = files.map((file) => file.path);
    const response = await uploadMany(filePaths);
    const fileData = response.map((file) => ({ url: file.url, publicId: file.publicId }));

    message = { fileData, text };
  } else if (files) {
    const filePaths = files.map((file) => file.path);
    const response = await uploadMany(filePaths);
    const fileData = response.map((file) => ({ url: file.url, publicId: file.publicId }));

    message = { fileData };
  } else if (text) {
    message = { text };
  } else throw ApiError(httpStatus.BAD_REQUEST, 'provide files or text as message');

  const msg = await groupService.postMessage({ message, groupId, sender: user._id, readBy: { userId: user._id } });
  res.send(201).send(msg);
});

const addMembers = catchAsync(async (req, res) => {
  const { body, params } = req;

  const group = await groupService.addMembers(params.groupId, body.members);

  if (!group) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'cannot add members');

  res.status(200).send('group members added');
});

const removeMembers = catchAsync(async (req, res) => {
  const { body, params } = req;

  const group = await groupService.removeMembers(params.groupId, body.members);

  if (!group) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'cannot add members');

  res.status(200).send('group members removed');
});

const getMessagesByGroupId = catchAsync(async (req, res) => {
  const msgs = await groupService.getMsgsByGroupId(req.params.groupId);
  if (!msgs) throw new ApiError(httpStatus.NOT_FOUND, 'resource not found');

  res.status(200).send(msgs);
});

const markMessagesSeen = catchAsync(async (req, res) => {
  const msg = await groupService.markMessageRead(req.params.groupId, req.user._id);
  if (!msg) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'cannot mark msg seen');

  res.status(200).send('updatd');
});

const deleteMessage = catchAsync(async (req, res) => {
  await groupService.markMsgDeleted(req.params.msgId);
  res.status(200).send('deleted');
});

const getGoupsRecentMsgs = catchAsync(async (req, res) => {
  const groups = await groupService.getGroupsByUseId(req.user._id);

  if (!groups.length) throw new ApiError(httpStatus.NOT_FOUND, 'user is in no group');

  const groupIds = groups.map((group) => group._id);
  const recentConversations = await groupService.getRecentGroupMsgs(groupIds, req.user._id);

  const msgs = recentConversations.map((group) => {
    const membersProfile = group.groupdata.membersProfile.flat();

    const seenBy = group.readBy.flat();

    return {
      id: group._id,
      msgId: group.msgId,
      groupId: group.groupId,
      sender: group.sender,
      msg: group.msg,
      createdAt: group.createdAt,
      unread: group.unread,
      seenBy,
      membersProfile,
    };
  });
  res.status(200).send(msgs);
});

const reportMessage = catchAsync(async (req, res) => {
  const { msgId, groupId, reason } = req.body;
  const report = await groupService.reportMessage(req.user._id, msgId, groupId, reason);

  if (!report) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'cannot report');

  res.status(200).send('reported');
});

const getReportedMessage = catchAsync(async (req, res) => {
  const reportedMsgs = await groupService.getReportedMsg(req.params.reportedId);
  if (!reportedMsgs) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'cannot get reported messages');
  res.status(200).send(reportedMsgs);
});

const getReportedMssages = catchAsync(async (req, res) => {
  const reportedMsgs = await groupService.getReportedMessages();
  if (!reportedMsgs) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'cannot get reported messages');
  res.status(200).send(reportedMsgs);
});

module.exports = {
  createGroup,
  getGroupById,
  getGroupByName,
  uploadLogo,
  deleteGroup,
  sendMessage,
  addMembers,
  removeMembers,
  getMessagesByGroupId,
  markMessagesSeen,
  deleteMessage,
  getGoupsRecentMsgs,
  reportMessage,
  getReportedMessage,
  getReportedMssages,
};

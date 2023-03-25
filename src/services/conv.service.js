const { Conv, Msg, ConvReport } = require('../models');

const createNewConv = async (id1, id2) => {
  const conv = await Conv.create({
    members: [id1, id2],
  });
  return conv;
};

const findConvByUsers = async (id1, id2) => {
  const conversation = await Conv.findOne({
    members: { $all: [id1, id2] },
  });
  return conversation;
};

const findById = async (id) => {
  const conversation = await Conv.findById(id);
  return conversation;
};

const postMessage = async (data, payload) => {
  const post = await Msg.create({
    convId: data.convId,
    message: payload,
    sender: data.sender,
    readBy: { userId: data.sender },
  });
  return post;
};

const getConvsByUserId = async (id) => {
  const conversation = await Conv.find({ members: { $in: id } });
  return conversation;
};

const blockConversation = async (convId, userId) => {
  const conv = await Conv.findByIdAndUpdate(convId, { blocked: true, $push: { blockedIds: userId } }, { new: true });
  return conv;
};

const unBlockConversation = async (convId, userId) => {
  const conv = await Conv.findByIdAndUpdate(convId, { blocked: false, $pull: { blockedIds: userId } }, { new: true });
  return conv;
};

const getMsgByConvId = async (convId) => {
  const conv = await Msg.find({ convId });
  return conv;
};

const markMsgRead = async (convId, userId) => {
  const msg = await Conv.updateMany(
    { convId, 'readBy.userId': { $ne: userId } },
    { $addToSet: { readBy: { userId } } },
    { multi: true }
  );
  return msg;
};

const markDeleted = async (msgId) => {
  const msg = await Msg.updateOne({ _id: msgId }, { isDeleted: true }, { new: true });
  return msg;
};

const report = async (reporter, reportedMsg, convId, reason) => {
  const reportA = await ConvReport.create({
    convId,
    reason,
    reportedMessage: reportedMsg,
    reporterId: reporter,
  });
  return reportA;
};

const getReports = async () => {
  const reports = await ConvReport.find({});
  return reports;
};

const getAReport = async (id) => {
  // eslint-disable-next-line no-shadow
  const report = await ConvReport.findById(id);
  return report;
};

const getRecentConversations = async (conversationsId, userId) => {
  const recentConv = Msg.aggregate(
    [
      {
        $match: { convId: { $in: conversationsId } },
      },
      // get all unread messages across each conversation
      {
        $project: {
          unread: {
            $cond: [{ $in: [userId, '$readBy.userId'] }, 0, 1],
          },
          convId: 1,
          message: 1,
          sender: 1,
          readBy: 1,
          createdAt: 1,
          isDeleted: 1,
        },
      },

      // group all messages based of their conversation ids then take last value for each field

      {
        $group: {
          _id: '$convId',
          msgId: { $last: '$_id' },
          convId: { $last: '$convId' },
          msg: { $last: '$message' },
          sender: { $last: '$sender' },
          unread: { $sum: '$unread' },
          createdAt: { $last: '$createdAt' },
          readBy: { $last: '$readBy' },
          isDeleted: { $last: '$isDeleted' },
        },
      },

      { $sort: { createdAt: -1 } },

      // get profile data of users
      {
        $lookup: {
          from: 'convs',
          localField: 'convId',
          foreignField: '_id',
          as: 'convdata',
        },
      },

      { $unwind: '$convdata' },
      { $unwind: '$convdata.members' },

      // join at user collection and populate memers profile data
      {
        $lookup: {
          from: 'users',
          localField: 'convdata.members',
          foreignField: '_id',
          as: 'convdata.membersProfile',
        },
      },

      {
        $group: {
          _id: '$convdata._id',
          msgId: { $last: '$msgId' },
          convId: { $last: '$convId' },
          msg: { $last: '$msg' },
          sender: { $last: '$sender' },
          readBy: { $addToSet: '$readBy' },
          convData: { $addToSet: '$convdata.membersProfile' },
          createdAt: { $last: '$createdAt' },
          unread: { $sum: '$unread' },
          isDeleted: { $last: '$isDeleted' },
          blocked: { $last: '$convdata.blockedIds' },
        },
      },
      { $sort: { createdAt: -1 } },
    ],
    { allowDiskUse: true }
  );
  return recentConv;
};

module.exports = {
  createNewConv,
  blockConversation,
  findById,
  findConvByUsers,
  getConvsByUserId,
  getMsgByConvId,
  getRecentConversations,
  markMsgRead,
  postMessage,
  unBlockConversation,
  markDeleted,
  report,
  getAReport,
  getReports,
};

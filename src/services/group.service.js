const { Group, GroupMsg, GroupReport } = require('../models');

const initiateGroup = async (data) => {
  const group = await Group.create(data);
  return group;
};

const updateGroupById = async (id, data, options) => {
  const group = await Group.findByIdAndUpdate(id, data, options);
  return group;
};

const deleteGroup = async (id) => {
  // eslint-disable-next-line no-return-await
  return await Group.findByIdAndDelete(id);
};

const findGroupById = async (id) => {
  const group = await Group.findById(id).populate('members', 'name avatar');
  return group;
};

const findGroupByName = async (name, userId) => {
  const group = await Group.findOne({ name }, { members: userId }).populate('members', 'name avatar');
  return group;
};

const blockUsers = async (id, usersId) => {
  const group = await Group.findByIdAndUpdate(id, { $addToSet: { blockIds: usersId } });
  return group;
};

const unblockUsers = async (id, usersId) => {
  const group = await Group.findByIdAndUpdate(id, { $pull: { blockIds: usersId } });
  return group;
};

const postMessage = async (data) => {
  const msg = await GroupMsg.create(data);
  return msg;
};

const markMsgDeleted = async (id) => {
  const msg = await GroupMsg.findByIdAndUpdate(id, { $set: { isDeleted: true } });
  return msg;
};

const addMembers = async (id, members) => {
  const group = await Group.findByIdAndUpdate(id, { $addToSet: { members } });
  return group;
};

const removeMembers = async (id, members) => {
  const group = await Group.findByIdAndUpdate(id, { $pull: { members: { $in: members } } });
  return group;
};

const markMessageRead = async (groupId, userId) => {
  const msg = await GroupMsg.updateOne(
    { groupId, 'readBy.userId': { $ne: userId } },
    {
      $addToSet: {
        readBy: { userId },
      },
    }
  );
  return msg;
};

const getMsgById = async (msgId) => {
  const msg = await GroupMsg.findById(msgId);
  return msg;
};

const getMsgsByGroupId = async (groupId) => {
  const messages = await GroupMsg.find({ groupId });
  return messages;
};

const checkIfUserIsAMember = async (userId, groupId) => {
  const group = await Group.findOne({ _id: groupId, members: { $in: userId } });
  return group;
};

const getGroupsByUseId = async (userId) => {
  const groups = await Group.find({ members: { $in: userId } });
  return groups;
};

const reportMessage = async (reporter, reportedMsg, groupId, reason) => {
  const report = await GroupReport.create({
    groupId,
    reason,
    reporterId: reporter,
    reportedMessage: reportedMsg,
  });
  return report;
};

const getReportedMsg = async (reportId) => {
  const report = await GroupReport.findById(reportId)
    .populate('reporterId', 'name avatar')
    .populate('reportedMessage')
    .populate('groupId');
  return report;
};

const getReportedMessages = async () => {
  const report = await GroupReport.find()
    .populate('reporterId', 'name avatar')
    .populate('reportedMessage')
    .populate('groupId');
  return report;
};
const getRecentGroupMsgs = async (groupIds, userId) => {
  const recentGroups = Group.aggregate([
    { $match: { groupId: { $in: groupIds } } },
    // get all unread messages
    {
      $project: {
        unread: {
          $cond: [{ $in: [userId, '$readBy.userId'] }, 0, 1],
        },
        groupId: 1,
        message: 1,
        sender: 1,
        readBy: 1,
        createdAt: 1,
        isDeleted: 1,
      },
    },
    // group all messages by their groupId then take the last messsage from each group
    {
      $group: {
        _id: '$groupId',
        msgId: { $last: '$_id' },
        groupId: { $last: '$groupId' },
        msg: { $last: '$message' },
        sender: { $last: '$sender' },
        createdAt: { $last: '$createdAt' },
        readBy: { $last: '$readBy' },
        unread: { $last: '$unread' },
      },
    },
    // get group details for each room
    {
      $lookup: {
        from: 'groups',
        localField: '_id',
        foreignField: '_id',
        as: 'groupdata',
      },
    },
    { $unwind: '$groupdata' },
    { $unwind: '$groupdata.members' },

    // get profile data of users who sent last messages
    {
      $lookup: {
        from: 'users',
        localField: 'groupdata.members',
        foreignField: '_id',
        as: 'groupdata.membersProfile',
      },
    },
    { $sort: { createdAt: -1 } },
  ]);
  return recentGroups;
};

module.exports = {
  initiateGroup,
  updateGroupById,
  deleteGroup,
  findGroupById,
  findGroupByName,
  blockUsers,
  unblockUsers,
  postMessage,
  markMsgDeleted,
  addMembers,
  removeMembers,
  markMessageRead,
  getMsgById,
  getMsgsByGroupId,
  checkIfUserIsAMember,
  getRecentGroupMsgs,
  getGroupsByUseId,
  reportMessage,
  getReportedMsg,
  getReportedMessages,
};

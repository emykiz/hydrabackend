const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { notificationService } = require('../services');

const getAllNotifiction = catchAsync(async (req, res) => {
    const notify = await notificationService.findAllNotification();
    if(!notify) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'no notification');
    res.status(200).send(notify);
})


const getOneNotification = catchAsync(async (req, res) => {
    const notify = await notificationService.findOneNotification(userId)
    if(!notify) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'no notification');
    res.status(200).send(notify)
})


const deleteOneNotification = catchAsync(async (req, res) => {
    const result = await notificationService.deleteOne(req.params.UserId);
    if (!result) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'no notification');
    res.status(200).send('succssfully deleted all notifications');
})

const updateNotificationIfSeen = catchAsync(async (req, res) => {
    const notify = await notificationService.updateNotification(req.params.UserId, req.body);
    if (!notify) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'no notification');
    res.status(200).send('notification seen')
})

module.exports = { getAllNotifiction, getOneNotification, deleteOneNotification, updateNotificationIfSeen };
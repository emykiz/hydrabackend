const { Notify } = require('../models');



/**
 * save notifications to database
 * @param {string} userId
 * @returns {Promise<Notice>}
 * */

const createNotification = async (userId) => {
    return await Notify.create(userId);
  };

// find All waitlist
/**
 * Get notification by user
 * @param {string} userId
 * @returns {Promise<Notice>}
 */
 const findAllNotification = async () => {
    return await Notify.find({});
  };


  // find One Notification
/**
 * Get notification by user
 * @param {string} userId
 * @returns {Promise<Notice>}
 */
  const findOneNotification = async (userId) => {
    const NotifyA = await Wait.findOne({ userId });
    return NotifyA;
  };
  

  // Delete All Notification
/**
 * Get notification by user
 * @param {string} userId
 * @returns {Promise<Notice>}
 */
  const deleteAll = async () => {
    return await Notify.deleteMany();
  };

// Delete One Notification
/**
 * Get notification by user
 * @param {string} userId
 * @returns {Promise<Notice>}
 */
const deleteOne = async () => {
    return await Notify.findOneAndDelete(userId);
}


//Update notification to true if seen
/**
* Get notification by user
* @param {string} userId
* @returns {Promise<Notice>}
*/
const updateNotification = async()=> {
   return await Notify.updateOne(userId, { isSeen: true }) 
}


module.exports = {
    createNotification,
    findAllNotification,
    findOneNotification,
    deleteAll,
    deleteOne,
    updateNotification
};
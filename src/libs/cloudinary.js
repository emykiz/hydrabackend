/* eslint-disable camelcase */
const cloud = require('cloudinary');
const path = require('path');
const { cloudinary } = require('../config/config');

require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

// configues the cloudinary sdk
cloud.v2.config(cloudinary);

/**
 * @param {string} filePath is the path of the file to be uploaded
 */
const uploadSingle = async (filePath) => {
  const { secure_url, public_id } = await cloud.v2.uploader.upload(filePath);
  return { url: secure_url, publicId: public_id };
};

const deleteSingle = async (fileUrl) => {
  // eslint-disable-next-line no-return-await
  return await cloud.v2.uploader.destroy(fileUrl);
};

/**
 * @param {Array<string>} filePaths
 */
const uploadMany = async (filePaths) => {
  // eslint-disable-next-line no-shadow
  const result = Promise.all(filePaths.map((path) => uploadSingle(path)));

  if (!result) throw new Error('cannot upload multiple files');

  return result;
};

/**
 * @param {Array<string>} fileUrls
 */
const deleteMany = async (fileUrls) => {
  // eslint-disable-next-line no-return-await
  return await cloud.v2.api.delete_resources(fileUrls);
};

module.exports = {
  uploadSingle,
  uploadMany,
  deleteSingle,
  deleteMany,
};

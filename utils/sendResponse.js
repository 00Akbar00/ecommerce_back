/**
 * Sends a standardized API response.
 *
 * @param {Object} res - Express response object
 * @param {number} statusCode - HTTP status code
 * @param {boolean} success - Indicates success or failure
 * @param {string} message - Message for the response
 * @param {Object|null} data - Optional data payload
 */

const sendResponse = (res, statusCode, success, message, data = null) => {
  const response = {
    success,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

module.exports = sendResponse;

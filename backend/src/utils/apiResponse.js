/**
 * Utility for standardized API responses
 */
class ApiResponse {
  static success(res, message, data = {}, statusCode = 200) {
    return res.status(statusCode).json({
      status: 'success',
      message,
      data,
    });
  }

  static error(res, message, errors = null, statusCode = 400) {
    return res.status(statusCode).json({
      status: 'error',
      message,
      errors,
    });
  }
}

module.exports = ApiResponse;

const sendErrorMsg = (res, statusCode = 400, message) =>
  res.status(statusCode).json({ message });

export default sendErrorMsg;

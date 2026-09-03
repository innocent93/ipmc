const { Parser } = require('json2csv');

exports.toCSV = (data, fields) => {
  const parser = new Parser({ fields });
  return parser.parse(data);
};

exports.exportMessages = (messages) => {
  const fields = ['name', 'email', 'phone', 'company', 'subject', 'message', 'isRead', 'isReplied', 'createdAt'];
  return exports.toCSV(messages, fields);
};

exports.exportSubscribers = (subscribers) => {
  const fields = ['email', 'isSubscribed', 'subscribedAt'];
  return exports.toCSV(subscribers, fields);
};

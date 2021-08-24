const { PERMISSION_DENIED } = require('./globals');

const denied = error => error?.code === PERMISSION_DENIED;

const attempt = (action, callback) =>
  action
    .then(() => callback(true))
    .catch(error => {
      if (denied(error)) {
        callback(false);
      } else throw error;
    });

module.exports = { attempt, denied };

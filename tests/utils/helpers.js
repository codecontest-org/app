const { PERMISSION_DENIED } = require('./globals');

const denied = error => error?.code === PERMISSION_DENIED;

// async function attempt(action, callback) {
//   try {
//     await action();
//     callback(true);
//   } catch (error) {
//     console.log(error);
//     if (denied(error)) {
//       callback(false);
//     }
//     throw error;
//   }
// }

const attempt = (action, callback) =>
  action
    .then(() => callback(true))
    .catch(error => {
      if (denied(error)) {
        callback(false);
      } else throw error;
    });

module.exports = { attempt, denied };

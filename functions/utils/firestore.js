const admin = require('firebase-admin');

/**
 * Get an admin firestore instance.
 */
exports.getDB = ({ params: { env } }) =>
  admin
    .firestore()
    .collection('env')
    .doc(env);

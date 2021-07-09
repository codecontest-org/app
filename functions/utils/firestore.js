const admin = require('firebase-admin');

// Initialize app.
admin.initializeApp();

/**
 * Get a firestore reference.
 */
exports.getRef = ({ params: { env } }, path) => admin.firestore().doc(`env/${env}/${path}`);

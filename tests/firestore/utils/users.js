const firebase = require('@firebase/rules-unit-testing');
const fs = require('fs');

/* ==============
 * === Schemas ==
 * ============== */

/**
 * User authentication data.
 */
class User {
  constructor(uid, email) {
    this.uid = uid;
    this.email = email;
  }

  data() {
    return {
      uid: this.uid,
      email: this.email
    };
  }
}

const schemas = { User };

/* =============
 * === Errors ==
 * ============= */

/**
 * Custom error for invalid user creation.
 */
class InvalidUserError extends Error {
  constructor() {
    super('Failed to initialize a firebase test application with the given user parameter!');
  }
}

const errors = { InvalidUserError };

/* ==============
 * === Methods ==
 * ============== */

/**
 * Create a new firebase admin app.
 */
function createAdminApp(projectId) {
  return firebase.initializeAdminApp({ projectId });
}

/**
 * Create a new firebase test app.
 */
function createUserApp(projectId, user) {
  if (user instanceof User || user === null) {
    const app = firebase.initializeTestApp({ projectId, auth: user ? user.data() : null });
    const rules = fs.readFileSync('../../firestore.rules', 'utf-8');
    firebase.loadFirestoreRules({ projectId, rules });
    return app;
  }
  throw new InvalidUserError();
}

/**
 * Clear test data and delete test firebase apps.
 */
async function cleanup(projectId, users) {
  await firebase.clearFirestoreData({ projectId });
  await Promise.all(users.map(u => u.delete()));
}

const methods = { createAdminApp, createUserApp, cleanup };

module.exports = { ...methods, ...errors, ...schemas };

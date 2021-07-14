const { testId, docId, userId } = require('./ids');
const { createAdminApp, createUserApp, User, cleanup } = require('./users');

const env = 'PRODUCTION';

class TestSuiteHelper {
  constructor(name, dataMembers) {
    this.name = name;
    this.email = `${name}@test.app`;
    this.members = dataMembers;
  }

  randomData() {
    const data = {};
    this.members.forEach(key => {
      data[key] = Math.random()
        .toString(16)
        .substr(2, 10);
    });
    return data;
  }

  tid(i) {
    return testId(this.name, i);
  }

  getDoc(user, documentId) {
    return user
      .firestore()
      .collection('env')
      .doc(env)
      .collection(this.name)
      .doc(documentId);
  }
}

class UnitTestHelper {
  constructor(i, about, suite) {
    this.id = suite.tid(i);
    this.about = about;
    this.suite = suite;
    this.wasRun = false;
    this.passed = true;
    this.users = null;
  }

  user(i) {
    return userId(this.id, i);
  }

  doc(i) {
    return docId(this.id, i);
  }

  createUsers(toggles) {
    const defaultToggles = {
      admin: true,
      user0: true,
      user1: false,
      user2: false,
      anonymous: true
    };
    const { admin, user0, user1, user2, anonymous } = { ...defaultToggles, ...toggles };
    if (this.users === null) {
      const users = {};
      const createAuthed = i => createUserApp(this.id, new User(this.user(i), this.suite.email));
      if (anonymous) users.anonymous = createUserApp(this.id, null);
      if (admin) users.admin = createAdminApp(this.id);
      if (user0) users.user0 = createAuthed(0);
      if (user1) users.user1 = createAuthed(1);
      if (user2) users.user2 = createAuthed(2);
      this.users = users;
      return users;
    }
    return this.users;
  }

  async run(assertions, handleError = () => {}) {
    try {
      await assertions();
    } catch (error) {
      this.passed = false;
      handleError(error);
    }
    this.wasRun = true;
  }

  results() {
    return [this.id, this.about, this.passed && this.wasRun];
  }

  async cleanup() {
    await cleanup(this.id, Object.values(this.users || {}));
  }
}

module.exports = { TestSuiteHelper, UnitTestHelper };

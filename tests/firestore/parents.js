const { assertFails, assertSucceeds } = require('@firebase/rules-unit-testing');
const { TestSuiteHelper, UnitTestHelper } = require('./utils/helpers');

const suite = new TestSuiteHelper('parents', ['fName', 'lName']);

async function parents0000() {
  const about = 'Test read permissions for the parents collection.';
  const test = new UnitTestHelper(0, about, suite);
  const { admin, user0, anonymous } = test.createUsers();
  const data = suite.randomData();

  await suite.getDoc(admin, test.doc(0)).set(data);

  await test.run(async () => {
    // Attempt to read a doc as an authenticated user.
    await assertSucceeds(suite.getDoc(user0, test.doc(0)).get());
    // Attempt to read a doc as an anonymous user.
    await assertFails(suite.getDoc(anonymous, test.doc(0)).get());
  });

  await test.cleanup();
  return test.results();
}

async function parents0001() {
  const about = 'Test create permissions for the parents collection.';
  const test = new UnitTestHelper(1, about, suite);
  const { user0, anonymous } = test.createUsers({ admin: false });
  const data = suite.randomData();

  await test.run(async () => {
    // Attempt to create a doc as an authenticated user.
    await assertSucceeds(suite.getDoc(user0, test.doc(0)).set(data));
    // Attempt to create a doc as an anonymous user.
    await assertFails(suite.getDoc(anonymous, test.doc(1)).set(data));
  });

  await test.cleanup();
  return test.results();
}

async function parents0002() {
  const about = 'Test update permissions for the parents collection.';
  const test = new UnitTestHelper(2, about, suite);
  const { admin, user0, user1, anonymous } = test.createUsers({ user1: true });
  const data0 = suite.randomData();
  const data1 = suite.randomData();

  await suite.getDoc(admin, test.user(0)).set(data0);
  await suite.getDoc(admin, test.doc(0)).set(data0);
  await suite.getDoc(admin, test.doc(1)).set(data0);

  await test.run(async () => {
    // Attempt to update a doc as a properly authenticated user.
    await assertSucceeds(suite.getDoc(user0, test.user(0)).update(data1));
    // Attempt to update a doc as an improperly authenticated user.
    await assertFails(suite.getDoc(user1, test.doc(0)).update(data1));
    // Attempt to update a doc as an anonymous user.
    await assertFails(suite.getDoc(anonymous, test.doc(1)).update(data1));
  });

  await test.cleanup();
  return test.results();
}

async function parents0003() {
  const about = 'Test delete permissions for the parents collection.';
  const test = new UnitTestHelper(3, about, suite);
  const { admin, user0, user1, anonymous } = test.createUsers({ user1: true });
  const data = suite.randomData();

  await suite.getDoc(admin, test.user(0)).set(data);
  await suite.getDoc(admin, test.doc(0)).set(data);
  await suite.getDoc(admin, test.doc(1)).set(data);

  await test.run(async () => {
    // Attempt to delete a doc as a properly authenticated user.
    await assertSucceeds(suite.getDoc(user0, test.user(0)).delete());
    // Attempt to delete a doc as an improperly authenticated user.
    await assertFails(suite.getDoc(user1, test.doc(0)).delete());
    // Attempt to delete a doc as an anonymous user.
    await assertFails(suite.getDoc(anonymous, test.doc(1)).delete());
  });

  await test.cleanup();
  return test.results();
}

module.exports = [parents0000, parents0001, parents0002, parents0003];

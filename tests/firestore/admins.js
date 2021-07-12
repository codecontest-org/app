const { assertFails } = require('@firebase/rules-unit-testing');
const { TestSuiteHelper, UnitTestHelper } = require('./utils/helpers');

const suite = new TestSuiteHelper('admins', ['secret']);

async function admins0000() {
  const about = 'Test read permissions for the admins collection.';
  const test = new UnitTestHelper(0, about, suite);
  const { admin, user0, anonymous } = test.createUsers();
  const data = suite.randomData();

  await suite.getDoc(admin, test.doc(0)).set(data);

  await test.run(async () => {
    // Attempt to read a doc as an authenticated user.
    await assertFails(suite.getDoc(user0, test.doc(0)).get());
    // Attempt to read a doc as an unauthenticated user.
    await assertFails(suite.getDoc(anonymous, test.doc(0)).get());
  });

  await test.cleanup();
  return test.results();
}

async function admins0001() {
  const about = 'Test create permissions for the admins collection.';
  const test = new UnitTestHelper(1, about, suite);
  const { user0, anonymous } = test.createUsers(false);
  const data = suite.randomData();

  await test.run(async () => {
    // Attempt to create a doc as an authenticated user.
    await assertFails(suite.getDoc(user0, test.doc(0)).set(data));
    // Attempt to create a doc as an unauthenticated user.
    await assertFails(suite.getDoc(anonymous, test.doc(1)).set(data));
  });

  await test.cleanup();
  return test.results();
}

async function admins0002() {
  const about = 'Test update permissions for the admins collection.';
  const test = new UnitTestHelper(2, about, suite);
  const { admin, user0, anonymous } = test.createUsers();
  const data0 = suite.randomData();
  const data1 = suite.randomData();

  await suite.getDoc(admin, test.doc(0)).set(data0);
  await suite.getDoc(admin, test.doc(1)).set(data0);

  await test.run(async () => {
    // Attempt to update a doc as an authenticated user.
    await assertFails(suite.getDoc(user0, test.doc(0)).update(data1));
    // Attempt to update a doc as an unauthenticated user.
    await assertFails(suite.getDoc(anonymous, test.doc(1)).update(data1));
  });

  await test.cleanup();
  return test.results();
}

async function admins0003() {
  const about = 'Test delete permissions for the admins collection.';
  const test = new UnitTestHelper(3, about, suite);
  const { admin, user0, anonymous } = test.createUsers();
  const data = suite.randomData();

  await suite.getDoc(admin, test.doc(0)).set(data);

  await test.run(async () => {
    // Attempt to delete a doc as an authenticated user.
    await assertFails(suite.getDoc(user0, test.doc(0)).delete());
    // Attempt to delete a doc as an unauthenticated user.
    await assertFails(suite.getDoc(anonymous, test.doc(0)).delete());
  });

  await test.cleanup();
  return test.results();
}

module.exports = [admins0000, admins0001, admins0002, admins0003];

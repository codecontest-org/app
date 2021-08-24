/**
 * Full test coverage for the firestore rules of the parents collection.
 *
 * All tests are run against parent, and anonymous users.
 * Some tests require an aditional user to check improper autentication.
 * We use the teacher user in these cases.
 */

const { v4: uuidv4 } = require('uuid');
const { useFirebase } = require('../utils/firebase');
const { attempt } = require('../utils/helpers');

const { db, auth } = useFirebase();

// Local helpers.
const doc = id => db.collection('parents').doc(id || auth.id());

test('Authenticated users can read any parent document.', async () => {
  expect.assertions(3);

  // Setup test document.
  await auth.parent();
  const parentDoc = doc();

  // Assertions.
  await auth.parent();
  await attempt(parentDoc.get(), r => expect(r).toBe(true));

  await auth.teacher();
  await attempt(parentDoc.get(), r => expect(r).toBe(true));

  await auth.none();
  await attempt(parentDoc.get(), r => expect(r).toBe(false));
});

test('Authenticated users can create a parent document.', async () => {
  expect.assertions(2);

  const data = { fName: 'Hello', lName: 'World' };

  // Assertions.
  await auth.parent();
  await attempt(doc(uuidv4()).set(data), r => expect(r).toBe(true));

  await auth.none();
  await attempt(doc(uuidv4()).set(data), r => expect(r).toBe(false));
});

test('Users can only update their own parent document.', async () => {
  expect.assertions(3);

  // Setup test document.
  await auth.parent();
  const parentDoc = doc();

  const data0 = { fName: 'New', lName: 'Name' };
  const data1 = { fName: 'Nombre', lName: 'Nuevo' };
  const data2 = { fName: 'Nouveau', lName: 'Nom' };

  // Assertions.
  await auth.parent();
  await attempt(parentDoc.update(data0), r => expect(r).toBe(true));

  await auth.teacher();
  await attempt(parentDoc.update(data1), r => expect(r).toBe(false));

  await auth.none();
  await attempt(parentDoc.update(data2), r => expect(r).toBe(false));
});

test('Users can only delete their own parent document.', async () => {
  expect.assertions(3);

  // Setup test document.
  await auth.parent();
  const parentDoc = doc();

  // Assertions.
  await auth.teacher();
  await attempt(parentDoc.delete(), r => expect(r).toBe(false));

  await auth.none();
  await attempt(parentDoc.delete(), r => expect(r).toBe(false));

  await auth.parent();
  await attempt(parentDoc.delete(), r => expect(r).toBe(true));
});

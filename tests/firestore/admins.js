const { denied } = require('../utils/globals');

async function admins0000(db, auth) {
  await auth.admin();
  const adminDoc = await db.collection('admins').doc(auth.id());
  try {
    await adminDoc.get();
    console.log('Test Failed!');
  } catch (error) {
    if (denied(error)) {
      console.log('Test Passed!');
    } else {
      console.error(error);
    }
  }
}

module.exports = { admins0000 };

/**
 * This file contains a set of unit tests for the Code Contest firestore
 * rules. These tests go over the entirety of the rule set and insure
 * that all data is accessible to users who should have access to it,
 * and protected from users who should not.
 *
 * References:
 *  - https://fireship.io/lessons/testing-firestore-security-rules-with-the-emulator/
 *  - https://firebase.google.com/docs/firestore/security/test-rules-emulator
 */

const admins = require('./admins');

const tests = { admins };

Object.values(tests).forEach(suite => {
  Promise.all(
    Object.entries(suite).map(async ([testName, runTest]) => {
      const passed = await runTest();
      console.log(` [${passed ? '✓' : '!'}] ${testName}`);
      return passed;
    })
  );
});

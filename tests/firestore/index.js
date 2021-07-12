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

const testSuites = { admins };

async function runAllTests() {
  console.log('[*] Running Firestore Rules Tests...\n');
  // Run tests and collect results.
  const results = await Promise.all(
    Object.values(testSuites).map(suite => Promise.all(suite.map(test => test())))
  );
  console.log('\n[*] Completed Test Runs.\n');
  console.log('Test Results:');
  // Log test results.
  let grandTotal = 0;
  let numOfTests = 0;
  results.forEach((suite, i) => {
    let total = 0;
    const suiteName = Object.keys(testSuites)[i];
    console.log(` * Tests for the ${suiteName} collection.`);
    suite.forEach(([id, about, passed]) => {
      if (passed) console.log(`    [✓] ${id}`);
      else console.log(`    [!] ${id} - ${about}`);
      total += passed ? 1 : 0;
    });
    console.log(`    (Passed ${total}/${suite.length})`);
    grandTotal += total;
    numOfTests += suite.length;
  });
  console.log(`\nPassing Tests: (${grandTotal}/${numOfTests})`);
}

runAllTests();

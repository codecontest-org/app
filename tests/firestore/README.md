# Firestore Rules Tests

This project attempts to create a reliable way to test the `firestore.rules` of this project.

We do this using the standard node.js firebase SDK running off local firebase simulators.

## Testing Methodology

These tests are designed to be a logical definition of the firestore rules for the parent project.
As such, they are responsible for verifying _CRUD_ functionality of data in each defined collection.
Each collection should be broken up into at least four tests. One for each function of _CRUD_.
The individual tests should verify that permitted users can complete the relevant task.
They should also verify that an array of unpermitted users cannot complete the relevant task.
This will be done by setting up a given task, and then attempting it with varying authentication states.

As an example, let's consider testing update permissions on a child document.
First, you might sign in as the child's parent and verify their ability to update the child data.
You might then sign in as a different parent and verify that they cannot update the child data.
It is also a good idea to double check that an unauthenticated request can't update it either.

Deciding which auth states are worth testing will depend a lot on how the rule you are testing is written.
Some rules might require more extensive testing, while more simple rules might only need a couple checks.

To reduce test complexity, test data will be defined and created by the cloud functions emulator.
It is likely that while writing new tests you won't have all the mock data you need.
To remedy this, you can define new data inside our cloud function's [loadMockData](https://github.com/codecontest-org/app/blob/55913a8add0909d6a319bca9c3cc38d6bce84110/functions/utils/firestore.js#L11) method. 

## Running Tests

```
# Session 0
npm run firebase

# Session 1
npm run test
```

> **Note:** Running the firebase emulators requires java to be installed.
> The emulators also require you use node v12 specifically.

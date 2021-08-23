/**
 * This file contains a series of classes that can be used to create "mock" firestore data.
 * Mock data can be useful when testing cloud functions locally. You can load the mock data
 * in the functions/utils/firestore.js file, and then manipulate the data in the firestore
 * emulator to trigger and test the results of the cloud functions.
 */

const { v4: uuid } = require('uuid');

const aMinute = 60000;
const anHour = aMinute * 60;
const aDay = anHour * 24;
const aWeek = aDay * 7;
const aYear = aWeek * 52;

/**
 * Mock Data Reference -> Firestore Reference.
 */
class Reference {
  constructor(collection, index) {
    const [name, items] = Object.entries(collection)[0];
    this.name = name;
    this.items = items;
    this.index = index;
  }

  get() {
    return this.items[this.index];
  }
}

/**
 * Mock Data Document -> Firestore Document.
 */
class Doc {
  constructor() {
    this.id = uuid();
  }

  setId(newId) {
    this.id = newId;
  }

  toJSON(fs, env) {
    const out = {};
    Object.entries(this).forEach(([key, value]) => {
      if (value instanceof Reference) {
        const fsRef = fs.doc(`env/${env}/${value.name}/${value.get().id}`);
        out[key] = fsRef;
      } else if (value instanceof Array && value.length > 0 && value[0] instanceof Reference) {
        out[key] = value.map(ref => fs.doc(`env/${env}/${ref.name}/${ref.get().id}`));
      } else out[key] = value;
    });
    return out;
  }
}

/**
 * Parent class for data types of people.
 */
class Person extends Doc {
  constructor(fName, lName) {
    super();
    this.fName = fName;
    this.lName = lName;
  }
}

/**
 * A document in the children collection.
 */
class Child extends Person {
  constructor(fName, lName, parent) {
    super(fName, lName);
    this.classes = [];
    this.tutorials = [];
    this.birthDate = new Date(Date.now() - 8 * aYear);
    this.currentGrade = 'pk';
    this.currentSchool = 'test school';
    this.gender = 'other';
    this.shirtSize = 'axl';
    this.parent = parent;
  }

  addClass(cls) {
    this.classes.push(cls);
  }
}

/**
 * A document in the parents collection.
 */
class Parent extends Person {
  constructor(fName, lName) {
    super(fName, lName);
    this.children = [];
    this.email = 'test@email.com';
    this.phone = '123-123-1234';
    this.canText = true;
    this.address = '123 Test Ln. Chicago IL';
  }

  addChild(kid) {
    this.children.push(kid);
  }
}

/**
 * A document in the admins collection.
 */
class Admin extends Doc {
  constructor(secret) {
    super();
    this.secret = secret;
  }
}

/**
 * A document in the teachers collection.
 */
class Teacher extends Doc {
  constructor(address) {
    super();
    this.address = address;
    this.classes = [];
    this.dateApplied = new Date(Date.now() - anHour);
    this.isDeclined = false;
    this.isRead = false;
    this.isTraining = false;
    this.isVerrified = true;
    this.location = 'school';
    this.prevExp = 'Lots and lots...';
    this.promos = [];
    this.region = 'New York, NY';
    this.whyTeach = 'Because I want to!';
  }

  addClass(cls) {
    this.classes.push(cls);
  }

  addPromo(promo) {
    this.promos.push(promo);
  }
}

/**
 * A document in the classes collection.
 */
class Class extends Doc {
  constructor(name, teacher) {
    super();
    this.name = name;
    this.children = [];
    this.daysOfWeek = ['Mon', 'Wed', 'Fri'];
    this.description = 'This is a test class.';
    this.endAge = 18;
    this.endDate = new Date(Date.now() + aDay);
    this.endTime = new Date(Date.now() + anHour);
    this.hasWaiver = false;
    this.isPrivate = false;
    this.locationAddress = '456 Test Ln. Chicago IL';
    this.locationName = 'Office Building';
    this.maxStudents = 30;
    this.minStudents = 10;
    this.price = 200;
    this.privacyCode = '';
    this.programType = 'contest';
    this.startAge = 10;
    this.startDate = new Date(Date.now() - aDay);
    this.startTime = new Date(Date.now() - anHour);
    this.teacher = teacher;
    this.waiverURL = '';
  }

  addChild(kid) {
    this.children.push(kid);
  }
}

/**
 * A document in the contestTeams collection.
 */
class Team extends Doc {
  constructor(name, cls) {
    super();
    this.name = name;
    this.classRef = cls;
    this.members = [];
    this.replURL = 'https://replit.com/@macuyler/zombe-test-june8';
    this.teamOwner = 'me!';
  }

  addMember(kid) {
    this.members.push(kid);
  }

  setOwner(parent) {
    this.teamOwner = parent;
  }
}

/**
 * A document in the contestTeamInvites collection.
 */
class TeamInvite extends Doc {
  constructor(kid, team) {
    super();
    this.childId = kid.id;
    this.classId = team.classRef.get().id;
    this.ownerId = team.teamOwner;
    this.parentId = kid.parent.get().id;
    this.teamId = team.id;
  }
}

module.exports = { Reference, Child, Parent, Admin, Teacher, Class, Team, TeamInvite };

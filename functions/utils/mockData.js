class Person {
  constructor(fName, lName) {
    this.fName = fName;
    this.lName = lName;
  }
}

class Child extends Person {
  constructor(fName, lName, parent) {
    super(fName, lName);
    this.birthDate = new Date(Date.now());
    this.currentGrade = 'pk';
    this.currentSchool = 'test school';
    this.gender = 'other';
    this.shirtSize = 'axl';
    this.parent = parent;
  }
}

class Parent extends Person {
  constructor(fName, lName) {
    super(fName, lName);
    this.email = 'test@email.com';
    this.phone = '123-123-1234';
    this.canText = true;
    this.address = '123 Test Ln. Chicago IL';
  }
}

class Class {
  constructor(name) {
    this.name = name;
    this.children = [];
    this.daysOfWeek = ['Mon', 'Wed', 'Fri'];
    this.description = 'This is a test class.';
    this.endAge = 18;
    this.endDate = new Date(Date.now());
    this.endTime = new Date(Date.now());
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
    this.startDate = new Date(Date.now());
    this.startTime = new Date(Date.now());
    this.waiverURL = '';
  }

  addChild(kid) {
    this.children.push(kid);
  }
}

class Team {
  constructor(name, cls) {
    this.name = name;
    this.class = cls;
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

class TeamInvite {
  constructor(kid, team) {
    this.childId = kid;
    this.classId = team.class;
    this.ownerId = team.teamOwner;
    this.parentId = kid.parent;
    this.teamId = team;
  }
}

module.exports = { Child, Parent, Class, Team, TeamInvite };

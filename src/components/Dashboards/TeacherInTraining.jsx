import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import Logout from '../Logout';

const TeacherInTrainingDashboard = ({ firebase, user }) =>
  user.isSignedIn ? (
    <div>
      <h1>Welcome to the Teacher in Training Dashboard</h1>
      <Logout firebase={firebase} />
    </div>
  ) : (
    <Redirect to="/" />
  );

TeacherInTrainingDashboard.propTypes = {
  firebase: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

export default TeacherInTrainingDashboard;
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { LinearProgress } from '@material-ui/core';
import { AccessTime, LocationOn } from '@material-ui/icons';
import { getDateString, getTime, calcSessions } from '../../helpers';
import { Template2 } from '../Images';

const SignUpsProgress = withStyles({
  root: {
    height: 6,
    backgroundColor: '#E0F4FD',
    borderRadius: 8
  },
  bar: {
    backgroundColor: '#00AFEF'
  }
})(LinearProgress);

const InfoCardHeader = ({ cls }) => (
  <div className="infocard-header">
    <div>
      <h5>{cls.name}</h5>
      <div className="inliner">
        <p>{`Start Date: ${getDateString(cls.startDate)}`}</p>
        <p>{`End Date: ${getDateString(cls.endDate)}`}</p>
      </div>
      <div className="inliner">
        <p>{`${calcSessions(cls)} Sessions`}</p>
        <p>
          <AccessTime fontSize="inherit" />
          {getTime(cls.startTime)}
        </p>
        <p>{`$${cls.price} per Student`}</p>
      </div>
      <div className="inliner col">
        <p>{cls.locationName}</p>
        <p>
          <LocationOn fontSize="inherit" />
          {cls.locationAddress}
        </p>
      </div>
      <div className="description">{cls.description}</div>
      <div className="progress-label">
        <h6>Students Sign-up</h6>
        <p>{`${cls.children.length}/${cls.maxStudents} STUDENTS`}</p>
      </div>
      <SignUpsProgress
        className="progress-bar"
        variant="determinate"
        color="primary"
        value={(cls.children.length / cls.maxStudents) * 100}
      />
      <div className="progress-overlay">
        <span style={{ marginLeft: `${(cls.minStudents / cls.maxStudents) * 100}%` }} />
      </div>
      <div className="bottom-line" />
    </div>
    <Template2 />
  </div>
);

InfoCardHeader.propTypes = {
  cls: PropTypes.object.isRequired
};

export default InfoCardHeader;

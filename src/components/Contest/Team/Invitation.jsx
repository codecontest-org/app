import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { useLiveTeamData } from '../../../hooks/teams';
import { db } from '../../../utils/firebase';

const propTypes = { invite: PropTypes.object.isRequired };

const Invitation = ({ invite: { teamId } }) => {
  const teamRef = useMemo(() => db.collection('contestTeams').doc(teamId), [teamId]);
  const team = useLiveTeamData(teamRef);
  return <Typography variant="h5">{team?.name}</Typography>;
};
Invitation.propTypes = propTypes;

export default Invitation;

import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Paper, Typography, makeStyles } from '@material-ui/core';
import { useLiveChild } from '../../../hooks/children';
import { useLiveTeamData } from '../../../hooks/teams';

import CreateScreen from './Create';
import MainScreen from './Main';
import ReplUI from './Repl';
import InfoItem from './Item';

const propTypes = {
  whoAmI: PropTypes.object,
  cls: PropTypes.object
};

const defaultProps = {
  whoAmI: null,
  cls: null
};

const ContestTeam = ({ whoAmI, cls }) => {
  const [toggles, setToggles] = useState({
    showCreate: false
  });
  const updateToggles = newToggles => setToggles({ ...toggles, ...newToggles });

  const teamRef = useMemo(() => {
    const myTeams = whoAmI?.teams;
    if (myTeams) {
      const team = myTeams[cls?.id];
      if (team) return team;
    }
    return null;
  }, [whoAmI]);
  const team = useLiveTeamData(teamRef);

  const ownerRef = useMemo(() => (team && team.members.length > 0 ? team.members[0] : null), [
    team
  ]);
  const owner = useLiveChild(ownerRef);

  const classes = useStyles();

  if (team !== null) {
    // Team Info Screen
    return (
      <Paper className={classes.paper}>
        <Typography variant="h3" align="center">
          My Team
        </Typography>
        <InfoItem title="Name">{team.name}</InfoItem>
        <InfoItem title="Owner">{owner ? `${owner.fName} ${owner.lName}` : ''}</InfoItem>
        <ReplUI team={team} teamRef={teamRef} />
      </Paper>
    );
  }

  if (toggles.showCreate)
    return <CreateScreen whoAmI={whoAmI} cls={cls} updateToggles={updateToggles} />;

  return <MainScreen updateToggles={updateToggles} />;
};
ContestTeam.propTypes = propTypes;
ContestTeam.defaultProps = defaultProps;

const useStyles = makeStyles({
  paper: {
    padding: 20,
    boxSizing: 'border-box'
  }
});

export default ContestTeam;

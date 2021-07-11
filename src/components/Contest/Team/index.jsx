import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Paper, Typography, makeStyles } from '@material-ui/core';
import { Add, Clear } from '@material-ui/icons';
import { useLiveChild } from '../../../hooks/children';
import { useLiveChildsTeamData } from '../../../hooks/teams';
import { db } from '../../../utils/firebase';

import CreateScreen from './Create';
import MainScreen from './Main';
import ReplUI from './Repl';
import InfoItem from './Item';
import InviteModal from './InviteModal';
import LeaveModal from './LeaveModal';

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
    showCreate: false,
    showLeave: false,
    showInviteModal: false
  });
  const updateToggles = newToggles => setToggles({ ...toggles, ...newToggles });

  const team = useLiveChildsTeamData(whoAmI?.ref, cls?.ref);

  const ownerRef = useMemo(() => (team && team.members.length > 0 ? team.members[0] : null), [
    team
  ]);
  const owner = useLiveChild(ownerRef);
  const iAmOwner = owner && owner?.id === whoAmI?.id;

  const leaveTeam = () => {
    if (team && owner && whoAmI && !iAmOwner) {
      db.collection('contstTeamQuitters')
        .doc()
        .set({
          teamRef: team.ref,
          childRef: whoAmI.ref
        });
    }
  };

  const classes = useStyles();

  const buttonConf = iAmOwner
    ? {
        title: 'Invite Members',
        onClick: () => updateToggles({ showInviteModal: true }),
        icon: <Add />
      }
    : { title: 'Leave Team', onClick: () => updateToggles({ showLeave: true }), icon: <Clear /> };

  if (team !== null) {
    // Team Info Screen
    return (
      <>
        <Paper className={classes.paper}>
          <Typography variant="h3" align="center">
            My Team
          </Typography>
          <InfoItem title="Name">{team.name}</InfoItem>
          <InfoItem title="Owner">{owner ? `${owner.fName} ${owner.lName}` : ''}</InfoItem>
          <ReplUI team={team} teamRef={team?.ref} />
          <Button
            variant="contained"
            color="primary"
            startIcon={buttonConf.icon}
            className={classes.inviteButton}
            onClick={buttonConf.onClick}
          >
            {buttonConf.title}
          </Button>
        </Paper>
        <InviteModal
          cls={cls}
          team={team}
          open={toggles.showInviteModal}
          onClose={() => updateToggles({ showInviteModal: false })}
        />
        <LeaveModal
          open={toggles.showLeave}
          onConfirm={leaveTeam}
          onClose={() => updateToggles({ showLeave: false })}
        />
      </>
    );
  }

  if (toggles.showCreate)
    return <CreateScreen whoAmI={whoAmI} cls={cls} updateToggles={updateToggles} />;

  return <MainScreen whoAmI={whoAmI} cls={cls} updateToggles={updateToggles} />;
};
ContestTeam.propTypes = propTypes;
ContestTeam.defaultProps = defaultProps;

const useStyles = makeStyles({
  paper: {
    padding: 20,
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  inviteButton: {
    marginTop: 20,
    alignSelf: 'flex-end'
  }
});

export default ContestTeam;

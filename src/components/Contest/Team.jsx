import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  IconButton,
  Paper,
  TextField,
  Tooltip,
  Typography,
  makeStyles
} from '@material-ui/core';
import { ArrowBack, Add } from '@material-ui/icons';
import clsx from 'clsx';
import { useAccountRef } from '../../hooks/accounts';
import { useLiveChild } from '../../hooks/children';
import { useLiveTeamData } from '../../hooks/teams';
import { replitURLValidation } from '../../utils/globals';
import { toData } from '../../utils/helpers';
import { db } from '../../utils/firebase';

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

  if (toggles.showCreate) return <CreateScreen />;

  return <MainScreen updateToggles={updateToggles} />;
};
ContestTeam.propTypes = propTypes;
ContestTeam.defaultProps = defaultProps;

/* ======================
 * === Sub-Components ===
 * ====================== */

/**
 * An interface that allows users to create a new team.
 */
const CreateScreen = ({ whoAmI, cls, updateToggles }) => {
  const parent = useAccountRef('parents');
  const [name, setName] = useState('');
  const classes = useStyles();

  const createTeam = async e => {
    e.preventDefault();
    if (whoAmI && cls) {
      const data = {
        name,
        teamOwner: parent?.id,
        members: [whoAmI?.ref],
        classRef: cls?.ref
      };
      const newTeamRef = db.collection('contestTeams').doc();
      await newTeamRef.set(data);
      joinTeam(newTeamRef);
    }
  };

  const joinTeam = async ref => {
    const childData = toData(await whoAmI.ref.get());
    const teamEntry = { [cls.id]: ref };
    let childTeams = childData.teams;
    if (childTeams) {
      childTeams = { ...childTeams, ...teamEntry };
    } else {
      childTeams = teamEntry;
    }
    whoAmI.ref.update({ teams: childTeams });
  };

  return (
    <Paper className={classes.paper}>
      <div className={classes.row}>
        <Tooltip title="Back">
          <IconButton
            size="small"
            edge="start"
            className={classes.backBtn}
            onClick={() => updateToggles({ showCreate: false })}
          >
            <ArrowBack />
          </IconButton>
        </Tooltip>
        <Typography variant="h3">Create a Team</Typography>
        <div style={{ display: 'block', width: 30 }} />
      </div>
      <Typography variant="body1" style={{ marginTop: 20 }}>
        Create a team and invite your teammates so you can work together to make an awesome game!
      </Typography>
      <form onSubmit={createTeam} className={classes.createForm}>
        <TextField
          variant="outlined"
          label="Team Name"
          placeholder="The C00l T3@m"
          className={classes.input}
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary">
          Create
        </Button>
      </form>
    </Paper>
  );
};
CreateScreen.propTypes = {
  whoAmI: PropTypes.object,
  cls: PropTypes.object,
  updateToggles: PropTypes.func.isRequired
};
CreateScreen.defaultProps = { whoAmI: null, cls: null };

/**
 * Gives users options on how to join a team.
 */
const MainScreen = ({ updateToggles }) => {
  const classes = useStyles();
  return (
    <Paper className={clsx([classes.paper, classes.centerCol])}>
      <Typography variant="h3" align="center">
        Join a Team
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        className={classes.mainBtn}
        onClick={() => updateToggles({ showCreate: true })}
      >
        Create a Team
      </Button>
    </Paper>
  );
};
MainScreen.propTypes = { updateToggles: PropTypes.func.isRequired };

/**
 * Allows users to set the repl url for their team.
 */
const ReplUI = ({ team, teamRef }) => {
  const [rurl, setRurl] = useState('');
  const [rurlError, setRError] = useState('');
  const classes = useStyles();

  const setReplURL = e => {
    e.preventDefault();
    if (replitURLValidation.test(rurl)) {
      if (teamRef !== null) {
        setRError('');
        teamRef.update({ replURL: rurl }).catch(() => setRError('Failed to set URL.'));
      } else {
        setRError('Failed to set URL.');
      }
    } else {
      setRError('Invalid Replit URL!');
    }
  };

  if (team?.replURL) {
    const abbr = team.replURL.replace('https://', '').replace('replit.com/', '');
    return (
      <InfoItem title="Replit">
        <a href={team.replURL} target="_blank" rel="noreferrer noopener">
          {abbr}
        </a>
      </InfoItem>
    );
  }
  return (
    <form onSubmit={setReplURL} className={classes.repl}>
      <TextField
        value={rurl}
        onChange={e => setRurl(e.target.value)}
        className={classes.input}
        variant="outlined"
        label="Replit URL"
        placeholder="https://replit.com/@user/code"
        error={rurlError !== ''}
        helperText={rurlError}
      />
      <Button type="submit" variant="contained" color="secondary" className={classes.submit}>
        Submit
      </Button>
    </form>
  );
};
ReplUI.propTypes = { team: PropTypes.object, teamRef: PropTypes.object };
ReplUI.defaultProps = { team: null, teamRef: null };

/**
 * A formatted information item.
 */
const InfoItem = ({ title, children }) => {
  const classes = useStyles();
  return (
    <Typography variant="h6" className={classes.infoItem}>
      <strong>{title}</strong>: {children}
    </Typography>
  );
};
InfoItem.propTypes = { title: PropTypes.string.isRequired, children: PropTypes.node.isRequired };

/* ========================
 * === Component Styles ===
 * ======================== */

const useStyles = makeStyles({
  paper: {
    padding: 20,
    boxSizing: 'border-box'
  },
  centerCol: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  createForm: {
    width: '100%',
    marginTop: 30,
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  backBtn: {
    flexShrink: 0,
    height: 30
  },
  mainBtn: {
    margin: '20px 0',
    padding: '6px 40px'
  },
  input: {
    flexGrow: 1,
    marginRight: 20
  },
  repl: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    marginTop: 20
  },
  submit: {
    padding: '6px 32px'
  },
  infoItem: {
    marginTop: 15,
    '& a': {
      color: 'var(--pink-color)',
      textDecoration: 'none'
    }
  }
});

export default ContestTeam;

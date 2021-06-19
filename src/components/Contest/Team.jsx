import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Paper, TextField, Typography, makeStyles } from '@material-ui/core';
import { useAccountRef } from '../../hooks/accounts';
import { useLiveTeamData } from '../../hooks/teams';
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
  const [name, setName] = useState('');
  const [rurl, setRurl] = useState('');
  const parent = useAccountRef('parents');
  const classes = useStyles();

  const teamRef = useMemo(() => {
    const team = whoAmI?.teams[cls?.id];
    if (team) return team;
    return null;
  }, [whoAmI]);

  const team = useLiveTeamData(teamRef);

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

  const setReplURL = e => {
    e.preventDefault();
    console.log('setting rurl', rurl);
  };

  const renderRepl = () => {
    if (team?.replURL) {
      return <Typography variant="h6">{team.replURL}</Typography>;
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
        />
        <Button type="submit" variant="contained" color="secondary" className={classes.submit}>
          Submit
        </Button>
      </form>
    );
  };

  if (team !== null) {
    return (
      <Paper className={classes.paper}>
        <Typography variant="h3">{team.name}</Typography>
        {renderRepl()}
      </Paper>
    );
  }

  return (
    <Paper className={classes.paper}>
      <Typography variant="h3">Team Info</Typography>
      <Typography variant="body1">
        Create a team and invite your teammates! Then work together to make an awesome game!
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
ContestTeam.propTypes = propTypes;
ContestTeam.defaultProps = defaultProps;

const useStyles = makeStyles({
  paper: {
    padding: 20,
    boxSizing: 'border-box'
  },
  createForm: {
    width: '100%',
    marginTop: 30,
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center'
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
  }
});

export default ContestTeam;

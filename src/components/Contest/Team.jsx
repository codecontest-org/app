import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Paper, TextField, Typography, makeStyles } from '@material-ui/core';
import { useAccountRef } from '../../hooks/accounts';
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
  const parent = useAccountRef('parents');
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
      const teamRef = db.collection('contestTeams').doc();
      await teamRef.set(data);
      joinTeam(teamRef);
    }
  };

  const joinTeam = async teamRef => {
    const childData = toData(await whoAmI.ref.get());
    const teamEntry = { [cls.id]: teamRef };
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
  }
});

export default ContestTeam;

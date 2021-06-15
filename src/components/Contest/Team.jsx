import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Paper, TextField, Typography, makeStyles } from '@material-ui/core';
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
  const classes = useStyles();

  const createTeam = e => {
    e.preventDefault();
    if (whoAmI && cls) {
      const data = {
        name,
        members: [whoAmI?.id],
        classId: cls?.id
      };
      db.collection('contestTeams')
        .doc()
        .set(data);
      console.log('Creating team:', data);
    }
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

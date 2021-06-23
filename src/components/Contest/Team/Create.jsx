import React, { useState } from 'react';
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
import { ArrowBack } from '@material-ui/icons';
import { useAccountRef } from '../../../hooks/accounts';
import { toData } from '../../../utils/helpers';
import { db } from '../../../utils/firebase';

const propTypes = {
  whoAmI: PropTypes.object,
  cls: PropTypes.object,
  updateToggles: PropTypes.func.isRequired
};

const defaultProps = { whoAmI: null, cls: null };

const CreateScreen = ({ whoAmI, cls, updateToggles }) => {
  const parent = useAccountRef('parents');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
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
      setError('');
      const newTeamRef = db.collection('contestTeams').doc();
      await newTeamRef.set(data);
      joinTeam(newTeamRef);
    } else {
      setError('Failed to create team.');
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
          error={error !== ''}
          helperText={error}
        />
        <Button type="submit" variant="contained" color="primary">
          Create
        </Button>
      </form>
    </Paper>
  );
};
CreateScreen.propTypes = propTypes;
CreateScreen.defaultProps = defaultProps;

const useStyles = makeStyles({
  paper: {
    padding: 20,
    boxSizing: 'border-box'
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
  input: {
    flexGrow: 1,
    marginRight: 20
  }
});

export default CreateScreen;

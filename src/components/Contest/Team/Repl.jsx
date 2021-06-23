import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, TextField, makeStyles } from '@material-ui/core';
import { replitURLValidation } from '../../../utils/globals';
import InfoItem from './Item';

const propTypes = { team: PropTypes.object, teamRef: PropTypes.object };
const defaultProps = { team: null, teamRef: null };

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
ReplUI.propTypes = propTypes;
ReplUI.defaultProps = defaultProps;

const useStyles = makeStyles({
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

export default ReplUI;

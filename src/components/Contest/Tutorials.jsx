import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Button, Paper, Typography, makeStyles } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { getLiveTutorialSelection, getFilteredLiveCheckOffsData } from '../../hooks/pages';
import { gameTypes } from '../../utils/globals';

const propTypes = {
  whoAmI: PropTypes.object,
  cls: PropTypes.object,
  page: PropTypes.string
};

const defaultProps = {
  whoAmI: null,
  cls: null,
  page: ''
};

const ContestTutorials = ({ whoAmI, cls, page }) => {
  const selection = getLiveTutorialSelection(whoAmI?.id, cls?.id);
  const checkOffs = getFilteredLiveCheckOffsData(a =>
    a
      .where('childId', '==', whoAmI?.id)
      .where('classId', '==', cls?.id)
      .where('approved', '==', true)
  );

  const coCount = useMemo(
    () => checkOffs.filter(co => co.page.includes(gameTypes[selection?.type])).length,
    [checkOffs, selection]
  );

  const pageUrl = useMemo(
    () => (page !== '' ? `/parent/tutorials?page=${page}` : '/parent/tutorials'),
    [page]
  );

  const typeTitle = useMemo(() => {
    const name = gameTypes[selection?.type];
    if (name) return name.concat(' Tutorial');
    return 'N/A';
  }, [selection]);

  const pageInfo = useMemo(() => {
    if (page !== '') {
      const parts = page.split('.');
      if (parts.length > 1) return parts;
      return [typeTitle, page];
    }
    return [typeTitle, 'Welcome to CodeContest'];
  }, [page, typeTitle]);

  const history = useHistory();
  const classes = useStyles();
  return (
    <Paper className={classes.paper}>
      <Typography variant="h4" className={classes.heading}>
        Tutorials
      </Typography>
      <div className={classes.row}>
        <Typography variant="body1">
          <strong>Turtorial:</strong> {pageInfo[0]}
        </Typography>
        <Typography variant="body1">
          <strong>Checkoffs:</strong> {coCount} / 9
        </Typography>
      </div>
      <div className={classes.row}>
        <Typography variant="body1">
          <strong>Current Step:</strong> {pageInfo[1]}
        </Typography>
        <Button variant="contained" color="primary" onClick={() => history.push(pageUrl)}>
          Open Tutorials
        </Button>
      </div>
    </Paper>
  );
};
ContestTutorials.propTypes = propTypes;
ContestTutorials.defaultProps = defaultProps;

const useStyles = makeStyles({
  paper: {
    padding: 20,
    boxSizing: 'border-box'
  },
  heading: {
    marginBottom: 10
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    padding: '10px 0',
    '& p': {
      flexGrow: 1
    }
  }
});

export default ContestTutorials;

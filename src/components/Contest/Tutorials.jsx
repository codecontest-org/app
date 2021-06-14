import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Button, Paper, Typography, makeStyles } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

const propTypes = {
  page: PropTypes.string
};

const defaultProps = {
  page: ''
};

const ContestTutorials = ({ page }) => {
  const pageUrl = useMemo(
    () => (page !== '' ? `/parent/tutorials?page=${page}` : '/parent/tutorials'),
    [page]
  );

  /**
   * TODO: Use the tutorial selection for the first
   * half of the page info...
   * ALSO: It might be cool to use local storage here
   * to create some kind of local persistence?
   */
  const pageInfo = useMemo(() => {
    if (page !== '') {
      const parts = page.split('.');
      if (parts.length > 1) return parts;
      return ['N/A', page];
    }
    return ['N/A', 'Welcome to CodeContest'];
  }, [page]);

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
          <strong>Checkoffs:</strong> 2 / 9
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

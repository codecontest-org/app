import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Button } from '@material-ui/core';
import NextIcon from '@material-ui/icons/NavigateNext';
import PrevIcon from '@material-ui/icons/NavigateBefore';
import { useFlatUnlockedItems } from '../../hooks/items';

const propTypes = {
  onNav: PropTypes.func.isRequired,
  current: PropTypes.string.isRequired,
  items: PropTypes.object.isRequired,
  locked: PropTypes.bool,
  whiteList: PropTypes.arrayOf(PropTypes.string)
};

const defaultProps = {
  locked: false,
  whiteList: []
};

const NavButtons = ({ current, items, locked, whiteList, onNav }) => {
  const flatUnlocks = useFlatUnlockedItems(items, locked, whiteList);
  const classes = useStyles();

  const nextPage = useMemo(() => {
    const i = flatUnlocks.indexOf(current);
    return i < flatUnlocks.length - 1 ? flatUnlocks[i + 1] : '';
  }, [current, flatUnlocks]);

  const prevPage = useMemo(() => {
    const i = flatUnlocks.indexOf(current);
    return i > 0 ? flatUnlocks[i - 1] : '';
  }, [current, flatUnlocks]);

  return (
    <div className={classes.wrapper}>
      <Button
        variant="outlined"
        onClick={() => onNav(prevPage)}
        disabled={prevPage === ''}
        startIcon={<PrevIcon />}
      >
        Prev
      </Button>
      <Button
        variant="outlined"
        onClick={() => onNav(nextPage)}
        disabled={nextPage === ''}
        endIcon={<NextIcon />}
      >
        Next
      </Button>
    </div>
  );
};
NavButtons.propTypes = propTypes;
NavButtons.defaultProps = defaultProps;

const useStyles = makeStyles({
  wrapper: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxSizing: 'border-box',
    padding: 16
  }
});

export default NavButtons;
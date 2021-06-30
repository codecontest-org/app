import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Input, InputAdornment, makeStyles } from '@material-ui/core';
import { Search } from '@material-ui/icons';
import clsx from 'clsx';

const propTypes = {
  handleSearch: PropTypes.func,
  classes: PropTypes.object
};

const defaultProps = {
  handleSearch: () => {},
  classes: {
    root: '',
    input: ''
  }
};

const SearchBar = ({ handleSearch, classes }) => {
  const [query, setQ] = useState('');
  const localClasses = useStyles();
  useEffect(() => handleSearch(query), [query]);
  return (
    <div className={clsx([localClasses.wrapper, classes.root])}>
      <Input
        placeholder="Search"
        value={query}
        onChange={e => setQ(e.target.value)}
        className={classes.input}
        disableUnderline
        fullWidth
        endAdornment={
          <InputAdornment>
            <Search />
          </InputAdornment>
        }
      />
    </div>
  );
};
SearchBar.propTypes = propTypes;
SearchBar.defaultProps = defaultProps;

const useStyles = makeStyles({
  wrapper: {
    padding: '5px 15px',
    boxSizing: 'border-box',
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.3)'
  }
});

export default SearchBar;

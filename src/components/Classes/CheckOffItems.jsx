import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Checkbox,
  Tooltip,
  IconButton,
  ListItemSecondaryAction,
  makeStyles
} from '@material-ui/core';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import { SwapHoriz } from '@material-ui/icons';
import Folder from '../UI/Folder';

const propTypes = {
  title: PropTypes.string.isRequired,
  other: PropTypes.string.isRequired,
  items: PropTypes.object.isRequired,
  onSwitch: PropTypes.func.isRequired,
  width: PropTypes.string.isRequired
};

const CheckOffItems = ({ title, items, onSwitch, other, width }) => {
  const [checked, setChecked] = useState([]);
  const classes = useStyles();

  const flattenItems = (fItems, prefix = '') => {
    const flattened = [];
    Object.entries(fItems).forEach(([key, value]) => {
      const item = prefix + key;
      if (typeof value === 'string') flattened.push(item);
      else flattened.push(...flattenItems(value, `${item}.`));
    });
    return flattened;
  };

  const flatItems = useMemo(() => flattenItems(items), [items]);

  const toggleAll = () => {
    if (checked.length === flatItems.length) {
      setChecked([]);
    } else setChecked(flatItems);
  };

  const handleToggle = value => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) newChecked.push(value);
    else newChecked.splice(currentIndex, 1);
    setChecked(newChecked);
  };

  return (
    <List className={classes.list}>
      <ListItem component="div" divider>
        <ListItemIcon>
          <Tooltip title="Select All" placement="top">
            <Checkbox
              edge="start"
              checked={checked.length === flatItems.length}
              onChange={toggleAll}
              tabIndex={-1}
            />
          </Tooltip>
        </ListItemIcon>
        <ListItemText
          primary={title}
          primaryTypographyProps={{ variant: 'h6' }}
          classes={{ root: classes.subHeaderRoot, primary: classes.subHeader }}
        />
        <ListItemSecondaryAction>
          {isWidthUp('sm', width) ? (
            <Button onClick={onSwitch} startIcon={<SwapHoriz />}>
              {other}
            </Button>
          ) : (
            <Tooltip title={other} placement="top">
              <IconButton onClick={onSwitch}>
                <SwapHoriz />
              </IconButton>
            </Tooltip>
          )}
        </ListItemSecondaryAction>
      </ListItem>
      {Object.entries(items).map(([item, value]) =>
        typeof value === 'string' ? (
          <ListItem button divider key={item} onClick={() => handleToggle(item)}>
            <ListItemIcon>
              <Checkbox edge="start" checked={checked.includes(item)} tabIndex={-1} disableRipple />
            </ListItemIcon>
            <ListItemText primary={item} />
          </ListItem>
        ) : (
          <Folder
            key={item}
            title={item}
            items={value}
            onClick={handleToggle}
            prefix={`${item}.`}
            checked={subItem => checked.includes(subItem)}
            useChecks
          />
        )
      )}
    </List>
  );
};
CheckOffItems.propTypes = propTypes;

const useStyles = makeStyles(theme => ({
  list: {
    width: '100%',
    maxWidth: 600,
    marginBottom: 18,
    padding: 0
  },
  subHeaderRoot: {
    marginBottom: 0
  },
  subHeader: {
    color: theme.palette.text.primary
  }
}));

export default withWidth()(CheckOffItems);

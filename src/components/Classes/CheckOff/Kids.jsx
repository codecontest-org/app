import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { List, ListItem, ListItemText, makeStyles } from '@material-ui/core';
import CheckOffPages from './Pages';
import TabPanel from '../../UI/TabPanel';
import { ModalHeader } from '../../UI/Modal';
import { useLiveChildren } from '../../../hooks/children';
import docs from '../../../resources/docs';
import tutorials from '../../../resources/tutorials';

const propTypes = {
  childRefs: PropTypes.arrayOf(PropTypes.object).isRequired
};

const CheckOffKids = ({ childRefs }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [selected, select] = useState(null);
  const children = useLiveChildren(childRefs);
  const classes = useStyles();

  const updateChild = newData => {
    if (selected !== null) selected.ref.update(newData);
  };

  return (
    <>
      <ModalHeader
        title={selected === null ? 'Check Off Progress' : `${selected.fName} ${selected.lName}`}
        backButton={selected !== null}
        onBack={() => {
          select(null);
          setTabIndex(0);
        }}
        variant="h4"
        classes={{ root: classes.header }}
      />
      <TabPanel value={tabIndex} index={0} className={classes.panel}>
        <List className={classes.list}>
          {children.length === 0 && (
            <ListItem>
              <ListItemText
                style={{ textAlign: 'center ' }}
                primary="Your students will show up here after they register!"
              />
            </ListItem>
          )}
          {children.map(child => (
            <ListItem
              button
              divider
              key={child.id}
              onClick={() => {
                select(child);
                setTabIndex(1);
              }}
            >
              <ListItemText primary={`${child.fName} ${child.lName}`} />
            </ListItem>
          ))}
        </List>
      </TabPanel>
      <TabPanel value={tabIndex} index={1} className={classes.panel}>
        <CheckOffPages
          title="Tutorials"
          other="Documentation"
          pages={tutorials}
          onSwitch={() => setTabIndex(2)}
          whiteList={selected?.tutorials}
          onChange={tuts => updateChild({ tutorials: tuts })}
        />
      </TabPanel>
      <TabPanel value={tabIndex} index={2} className={classes.panel}>
        <CheckOffPages
          title="Documentation"
          other="Tutorials"
          pages={docs}
          onSwitch={() => setTabIndex(1)}
          whiteList={selected?.docs}
          onChange={dcs => updateChild({ docs: dcs })}
        />
      </TabPanel>
    </>
  );
};
CheckOffKids.propTypes = propTypes;

const useStyles = makeStyles({
  header: { margin: '20px 0 0 0' },
  list: {
    width: '100%',
    maxWidth: 600,
    marginBottom: 18,
    padding: 0
  },
  panel: {
    width: '100%'
  }
});

export default CheckOffKids;

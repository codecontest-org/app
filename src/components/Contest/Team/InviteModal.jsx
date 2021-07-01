import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  makeStyles
} from '@material-ui/core';
import Modal, { ModalHeader } from '../../UI/Modal';
import SearchBar from '../../UI/SearchBar';
import { useChildren } from '../../../hooks/children';
import { db } from '../../../utils/firebase';

const propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  cls: PropTypes.object,
  team: PropTypes.object
};

const defaultProps = {
  open: false,
  onClose: () => {},
  cls: null,
  team: null
};

const InviteModal = ({ open, onClose, cls, team }) => {
  const [children, isLoading] = useChildren(cls?.children);
  const [search, setSearch] = useState('');
  const classes = useStyles();

  const searchFilter = c => `${c.fName} ${c.lName}`.toLowerCase().includes(search.toLowerCase());

  const invite = child => {
    if (team !== null) {
      const data = {
        childId: child.id,
        parentId: child.parent.id,
        ownerId: team.teamOwner,
        teamId: team.id
      };
      db.collection('contestTeamInvites')
        .doc()
        .set(data);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalHeader title="Invite Members" backButton onBack={onClose} />
      <SearchBar classes={{ root: classes.search }} handleSearch={setSearch} />
      {isLoading ? (
        <CircularProgress />
      ) : (
        <List classes={{ root: classes.listRoot }}>
          {children
            .sort((a, b) => (a.fName < b.fName ? -1 : 1)) // Alphabetize
            .filter(searchFilter) // Apply search
            .map(child => (
              <ListItem key={child.id} divider>
                <ListItemText>
                  {child.fName} {child.lName}
                </ListItemText>
                <ListItemSecondaryAction>
                  <Button variant="outlined" color="secondary" onClick={() => invite(child)}>
                    Invite
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
        </List>
      )}
      <Button onClick={onClose} className={classes.closeBtn}>
        Close
      </Button>
    </Modal>
  );
};
InviteModal.propTypes = propTypes;
InviteModal.defaultProps = defaultProps;

const useStyles = makeStyles({
  listRoot: {
    width: '100%'
  },
  closeBtn: {
    marginTop: 15,
    padding: '6px 32px'
  },
  search: {
    width: '100%',
    margin: '10px 20px'
  }
});

export default InviteModal;

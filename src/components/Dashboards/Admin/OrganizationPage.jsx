import React from 'react';
import PropTypes from 'prop-types';
import { MenuItem, TextField, List, Divider, Drawer } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import autoBind from '../../../autoBind';
import OrganizationRequest from '../../Requests/Organization';
import Spinner from '../../Spinner';

let cancelOrganizationSub = () => {};

const propTypes = {
  firebase: PropTypes.object.isRequired,
  db: PropTypes.object.isRequired,
  showSideDrawer: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func.isRequired
};

class AdminOrganizationPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orgReqs: [],
      originalReqs: [],
      isLoadingOrgs: true,
      shouldShowRead: 'both',
      shouldShowOrgType: 'pending',
      shouldShowName: ''
    };
    this.firebase = this.props.firebase;
    this.db = this.props.db;
    autoBind(this);
  }

  componentDidMount() {
    cancelOrganizationSub = this.getRequestsFromCollection();
  }

  componentWillUnmount() {
    cancelOrganizationSub();
  }

  getRequestsFromCollection() {
    return this.db.collection('organizations').onSnapshot(users => {
      const requests = users.docs.map(u => ({ id: u.id, ...u.data() }));
      requests.sort((a, b) => {
        return new Date(b.dateApplied.seconds) - new Date(a.dateApplied.seconds);
      });
      const newState = {};
      newState.orgReqs = requests.filter(t => !t.isVerrified).filter(t => !t.isDeclined);
      newState.originalReqs = requests;
      newState.isLoadingOrgs = false;
      this.setState({ ...newState });
    });
  }

  getFilteredOrgs() {
    return (
      <List>
        <Divider />
        {this.state.orgReqs.map(org => (
          <OrganizationRequest
            db={this.db}
            org={org}
            acceptRequest={o => this.acceptRequest(o, 'organizations')}
            declineRequest={o => this.declineRequest(o, 'organizations')}
            key={org.id}
          />
        ))}
      </List>
    );
  }

  handleChange(e) {
    const { id, name, value } = e.target;
    const newState = {};
    if (id) {
      newState[id] = value;
    } else {
      newState[name] = value;
    }
    this.setState({ ...newState }, () => {
      let orgArray = this.state.originalReqs;

      if (this.state.shouldShowName === '') {
        if (this.state.shouldShowRead === 'true') {
          orgArray = orgArray.filter(t => {
            return t.isRead;
          });
        } else if (this.state.shouldShowRead === 'false') {
          orgArray = orgArray.filter(t => {
            return !t.isRead;
          });
        }

        if (this.state.shouldShowOrgType === 'pending') {
          orgArray = orgArray.filter(t => {
            return t.isVerrified === false && t.isDeclined === false;
          });
        } else if (this.state.shouldShowOrgType === 'approved') {
          orgArray = orgArray.filter(t => {
            return t.isVerrified;
          });
        } else if (this.state.shouldShowOrgType === 'declined') {
          orgArray = orgArray.filter(t => {
            return t.isDeclined;
          });
        }
      } else {
        const orgNameSearch = this.state.shouldShowName;
        orgArray = orgArray.filter(t => {
          return t.name.toLowerCase().includes(orgNameSearch.toLowerCase());
        });
      }

      newState.orgReqs = orgArray;
      this.setState({ ...newState });
    });
  }

  acceptRequest(user, collection) {
    this.db
      .collection(collection)
      .doc(user.id)
      .update({ isVerrified: true });
  }

  declineRequest(user, collection) {
    this.db
      .collection(collection)
      .doc(user.id)
      .update({ isDeclined: true });
  }

  render() {
    return this.state.isLoadingOrgs ? (
      <Spinner color="primary" />
    ) : (
      <>
        <Drawer
          className="filter-drawer"
          variant="persistent"
          anchor="left"
          open={this.props.showSideDrawer}
        >
          <div className="close-side-drawer">
            <IconButton onClick={this.props.toggleDrawer}>
              <ChevronLeftIcon fontSize="large" />
            </IconButton>
          </div>
          <h3>Filters</h3>
          <div className="inline">
            <p>Read, Unread, Both</p>
            <TextField
              id="shouldShowRead"
              name="shouldShowRead"
              select
              value={this.state.shouldShowRead}
              onChange={this.handleChange}
            >
              <MenuItem value="both">Both</MenuItem>
              <MenuItem value="true">Read Only</MenuItem>
              <MenuItem value="false">Unread Only</MenuItem>
            </TextField>
            <p>Show only Organizations Teachers</p>
            <TextField
              id="shouldShowOrgType"
              name="shouldShowOrgType"
              select
              value={this.state.shouldShowOrgType}
              onChange={this.handleChange}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="declined">Declined</MenuItem>
            </TextField>
            <br />
            <br />
            <TextField
              id="shouldShowName"
              className="filter-input"
              type="text"
              label="Search by Name"
              value={this.state.shouldShowName}
              onChange={this.handleChange}
            />
          </div>
        </Drawer>
        {this.getFilteredOrgs()}
      </>
    );
  }
}

AdminOrganizationPage.propTypes = propTypes;

export default AdminOrganizationPage;
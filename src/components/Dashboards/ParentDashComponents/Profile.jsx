import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import StarBorder from '@material-ui/icons/StarBorder';
import AccountCircle from '@material-ui/icons/AccountCircle';
import EmailIcon from '@material-ui/icons/Email';
import SmartPhoneIcon from '@material-ui/icons/Smartphone';
import AccountChildIcon from '@material-ui/icons/AccountBox';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Paper from '@material-ui/core/Paper';
import Spinner from '../../Spinner';
import autoBind from '../../../autoBind';
import '../../../assets/css/Parent-Dash.css';
import EditModal from './EditModal';
// import classes from '*.module.css';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoadingUser: true,
      currentUser: null,
      childrenArray: undefined,
      showChildData: [],
      showEditAttribute: false,
      editableData: null
    };
    this.user = this.props.user;
    this.firebase = this.props.firebase;
    this.db = this.firebase
      .firestore()
      .collection('env')
      .doc('DEVELOPMENT');
    autoBind(this);
  }

  useStyles() {
    makeStyles(theme => ({
      root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper
      },
      nested: {
        paddingLeft: theme.spacing(4)
      },
      paper: {
        padding: theme.spacing(3, 2),
      }
    }));
  }

  componentDidMount() {
    this.db
      .collection('parents')
      .doc(this.user.uid)
      .onSnapshot((doc) => {
        const newState = {
          childrenArray: [],
          showChildData: []
        };
        newState.currentUser = doc.data();
        if (doc.data().children !== undefined) {
          doc.data().children.map(childRef => {
            childRef.onSnapshot(child => {

              var childExists = newState.childrenArray.findIndex(existingChild => {
                return existingChild.id === child.id;
              });
              if (childExists === -1) {
              var newChild = {};
              newChild.id = child.id;
              newChild.data = child.data();
              var showData = {};
              showData.id = child.id;
              showData.open = false;
              newState.childrenArray.push({...newChild});
              newState.showChildData.push({...showData});
              } else {
                newState.childrenArray[childExists].data = child.data();
              }
              newState.isLoadingUser = false;
              this.setState({ ...newState });
            });
          });
        } else {
          newState.isLoadingUser = false;
          this.setState({ ...newState });
        }
      });
  }

  getChildArrayObj(id) {
    var tempArray = this.state.showChildData;
    console.log('1 tempArray: ', tempArray);
    var index = tempArray.map(function(x) {return x.id}).indexOf(id);
    console.log('1 index: ', index);
    var status = this.state.showChildData[index].open;
    return status;
  }

  showChildList(id) {
    var tempArray = this.state.showChildData;
    console.log('2 tempArray: ', tempArray);
    var index = tempArray.map(function(x) {return x.id}).indexOf(id);
    console.log('2 index: ', index);
    var status = this.state.showChildData[index].open;

    tempArray[index].open = !status;
    this.setState({ showChildData: tempArray });
    
    // this.setState(prevState => ({
    //   showChildData: {
    //       ...prevState.showChildData,
    //       [prevState.showChildData[index].open]: !status,
    //   },
    // }));
  }

  showModal(data) {
    var newState = {};
    newState.showEditAttribute = !this.state.showEditAttribute;
    if (data !== null) {
      newState.editableData = data;
    }
    this.setState({ ...newState });
  }

  render() {
    return this.state.isLoadingUser === false ? (
      <>
          <Paper className="paper-list-item">
          <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                Parent Account
              </ListSubheader>
            }
            className={this.useStyles.root}
          >
            <ListItem button onClick={() => this.showModal({firebase: this.firebase, heading: 'Name', attribute: 'name', id: this.user.uid, collection: 'parents'})}>
              <ListItemIcon>
                <AccountCircle />
              </ListItemIcon>
              <ListItemText
                primary={`${this.state.currentUser.fName} ${this.state.currentUser.lName}`}
              />
            </ListItem>
            <ListItem button onClick={() => this.showModal({firebase: this.firebase, heading: 'Phone', attribute: 'phone', id: this.user.uid, collection: 'parents'})}>
              <ListItemIcon>
                <SmartPhoneIcon />
              </ListItemIcon>
              <ListItemText primary={this.state.currentUser.phone} />
            </ListItem>
          </List>
          </Paper>
            {this.state.childrenArray.length > 0 ? (
              <>
                {this.state.childrenArray.map(child => (
                  <Paper className="paper-list-item"  key={child.id}>
                    <List
                      component="nav"
                      aria-labelledby="nested-list-subheader"
                      subheader={
                        <ListSubheader component="div" id="nested-list-subheader">
                          Child's Information
                        </ListSubheader>
                      }
                      className={this.useStyles.root}
                    >
                        <ListItem button className="child-list-item" onClick={() => this.showChildList(child.id)}>
                          <ListItemIcon>
                            <StarBorder />
                          </ListItemIcon>
                        <ListItemText primary={`${child.data.fName} ${child.data.lName}`} />
                      {this.getChildArrayObj(child.id) ? <ExpandLess /> : <ExpandMore />}
                      </ListItem>
                      <Collapse in={this.state.showChildData.find(obj => obj.id === child.id).open} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                          <ListItem button className="child-list-item" onClick={() => this.showModal({firebase: this.firebase, heading: "Child's Name", attribute: 'name', id: child.id, collection: 'children'})}>
                            <ListItemIcon>
                              <StarBorder />
                            </ListItemIcon>
                            <ListItemText primary={`${child.data.fName} ${child.data.lName}`} />
                          </ListItem>
                        </List>
                      </Collapse>
                    </List>
                  </Paper>
                ))}
              </>
            ) : (
              <></>
            )}
        {this.state.showEditAttribute === true ? <EditModal data={this.state.editableData} cancel={this.showModal} db={this.db}/> : <></>}
      </>
    ) : (
      <Spinner color="primary" />
    );
  }
}

export default Profile;

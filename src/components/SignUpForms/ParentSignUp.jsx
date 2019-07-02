import React from 'react';
import PropTypes from 'prop-types';
import ChildInfo from './ChildInfo';
import '../../assets/css/Signup.css';
import autoBind from '../../autoBind';

class ParentSignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      address: PropTypes.string.isRequired
    };
    autoBind(this);
  }

  // const propTypes = {
  //   handleChange: PropTypes.func.isRequired,
  //   toggleCanText: PropTypes.func.isRequired,
  //   state: PropTypes.shape({
  //     fName: PropTypes.string.isRequired,
  //     lName: PropTypes.string.isRequired,
  //     address: PropTypes.string.isRequired,
  //     email: PropTypes.string.isRequired,
  //     phone: PropTypes.string.isRequired,
  //     canText: PropTypes.bool.isRequired
  //   }).isRequired
  // };
  handleChange(e) {
    const { id, value } = e.target;
    const newState = {};
    newState[id] = value;
    this.setState(newState);
  }

  // const ParentSignUp = (props, { handleChange, state, toggleCanText }) => (
  render() {
    return (
      <div className="signup-form">
        <h1>Parent Account Information:</h1>
        <label htmlFor="firstname">
          Street Address:
          <input id="address" type="text" value={this.state.address} onChange={this.handleChange} />
        </label>
        <br />
        <ChildInfo
          /* handleChange={handleChange}
          state={this.state}
          toggleCanText={toggleCanText} */
          db={this.props.db}
          firebase={this.props.firebase}
          address={this.state.address}
        />
        <br />
      </div>
    );
  }
  // );
}

// ParentSignUp.propTypes = propTypes;

export default ParentSignUp;

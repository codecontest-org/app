import React from 'react';
import { Card, CardHeader, CardContent, TextField } from '@material-ui/core';
import { KeyboardDatePicker } from '@material-ui/pickers';
import autoBind from '../../autoBind';

class CreateClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      startDate: new Date(),
      endDate: new Date()
    };
    autoBind(this);
  }

  setDate(date, dateType) {
    const newState = {};
    newState[dateType] = date;
    this.setState(newState);
  }

  handleInput(e) {
    const newState = this.state;
    newState[e.target.id] = e.target.value;
    this.setState({ ...newState });
  }

  render() {
    return (
      <Card style={{ width: '80%', height: '50vh' }}>
        <CardHeader title="Create a Class" />
        <CardContent>
          <TextField
            id="name"
            type="text"
            label="Class Name"
            variant="outlined"
            value={this.state.name}
            onChange={this.handleInput}
          />
          <KeyboardDatePicker
            clearable
            value={this.state.startDate}
            placeholder="10/10/2010"
            onChange={date => this.setDate(date, 'startDate')}
            minDate={new Date()}
            helperText="Start Date"
            format="MM/dd/yyyy"
          />
          <KeyboardDatePicker
            clearable
            value={this.state.endDate}
            placeholder="11/11/2011"
            onChange={date => this.setDate(date, 'endDate')}
            minDate={new Date()}
            helperText="End Date"
            format="MM/dd/yyyy"
          />
        </CardContent>
      </Card>
    );
  }
}

export default CreateClass;

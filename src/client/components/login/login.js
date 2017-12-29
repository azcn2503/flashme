import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import { login } from "client/state/actions/user";
import TextField from "client/components/textfield/textfield";
import Button from "client/components/button/button";
import Tabs from "client/components/tabs/tabs";
import Tab from "client/components/tab/tab";

import styles from "./login.scss";

class Login extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onSubmitForm = this.onSubmitForm.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.username !== this.state.username ||
      prevState.password !== this.state.password
    ) {
      if (this.props.onChange) {
        this.props.onChange(this.state);
      }
    }
  }

  onSubmitForm(e) {
    e.preventDefault();
    this.submit();
  }

  onChangeUsername(e) {
    this.setState({
      username: e.target.value
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value
    });
  }

  submit() {
    if (this.state.username && this.state.password) {
      this.props.dispatch(login(this.state.username, this.state.password));
      if (this.props.onSubmit) {
        this.props.onSubmit();
      }
    }
  }

  renderActions() {
    return (
      <div className={styles.actions}>
        <Button
          primary
          submit
          disabled={this.state.username === "" || this.state.password === ""}
        >
          Log in
        </Button>
      </div>
    );
  }

  render() {
    return (
      <div className={styles.login}>
        <p>Please note that login is not working yet!</p>
        <Tabs>
          <Tab>Login</Tab>
          <Tab>Register</Tab>
        </Tabs>
        <form onSubmit={this.onSubmitForm}>
          <TextField
            placeholder="Username"
            type="text"
            value={this.state.username}
            onChange={this.onChangeUsername}
            fullWidth
          />
          <TextField
            placeholder="Password"
            type="password"
            value={this.state.password}
            onChange={this.onChangePassword}
            fullWidth
          />
          {this.renderActions()}
        </form>
      </div>
    );
  }
}

Login.propTypes = {
  dispatch: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func
};

export default Login;

import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import { login, register } from "client/state/actions/user";
import { resetSubjects, getSubjects } from "client/state/actions/subjects";
import { resetCards } from "client/state/actions/cards";
import { resetTests } from "client/state/actions/tests";
import TextField from "client/components/textfield/textfield";
import Button from "client/components/button/button";
import Tabs from "client/components/tabs/tabs";
import Tab from "client/components/tab/tab";

import styles from "./login.scss";

const tabEnum = {
  LOGIN: "LOGIN",
  REGISTER: "REGISTER"
};

class Login extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      activeTabId: tabEnum.LOGIN
    };
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangeConfirmPassword = this.onChangeConfirmPassword.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onSubmitLoginForm = this.onSubmitLoginForm.bind(this);
    this.onSubmitRegisterForm = this.onSubmitRegisterForm.bind(this);
    this.onChangeTabs = this.onChangeTabs.bind(this);
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

  onSubmitLoginForm(e) {
    e.preventDefault();
    this.submitLoginForm();
  }

  onSubmitRegisterForm(e) {
    e.preventDefault();
    this.submitRegisterForm();
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

  onChangeConfirmPassword(e) {
    this.setState({
      confirmPassword: e.target.value
    });
  }

  onChangeEmail(e) {
    this.setState({
      email: e.target.value
    });
  }

  onChangeTabs(tabId) {
    this.setState({
      activeTabId: tabId
    });
  }

  canLogin() {
    return this.state.username !== "" && this.state.password !== "";
  }

  canRegister() {
    return (
      this.state.username !== "" &&
      this.state.password !== "" &&
      this.state.confirmPassword !== "" &&
      this.state.email !== "" &&
      this.state.password === this.state.confirmPassword
    );
  }

  submitLoginForm() {
    if (this.canLogin()) {
      this.props
        .dispatch(login(this.state.username, this.state.password))
        .then(() => {
          this.props.dispatch(resetSubjects());
          this.props.dispatch(resetCards());
          this.props.dispatch(resetTests());
          this.props.dispatch(getSubjects());
          if (this.props.onSuccess) {
            this.props.onSuccess();
          }
        });
    }
  }

  submitRegisterForm() {
    if (this.canRegister()) {
      this.props
        .dispatch(
          register(this.state.username, this.state.password, this.state.email)
        )
        .then(() => this.submitLoginForm());
    }
  }

  renderLogin() {
    if (this.state.activeTabId === tabEnum.LOGIN) {
      return (
        <form onSubmit={this.onSubmitLoginForm}>
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
          <div className={styles.actions}>
            <Button primary submit disabled={!this.canLogin()}>
              Log in
            </Button>
          </div>
        </form>
      );
    } else {
      return null;
    }
  }

  renderRegister() {
    if (this.state.activeTabId === tabEnum.REGISTER) {
      return (
        <form onSubmit={this.onSubmitRegisterForm}>
          <TextField
            placeholder="Username"
            type="text"
            value={this.state.username}
            onChange={this.onChangeUsername}
            fullWidth
          />
          <TextField
            placeholder="Email address"
            type="text"
            value={this.state.email}
            onChange={this.onChangeEmail}
            fullWidth
          />
          <TextField
            placeholder="Password"
            type="password"
            value={this.state.password}
            onChange={this.onChangePassword}
            fullWidth
          />
          <TextField
            placeholder="Confirm password"
            type="password"
            value={this.state.confirmPassword}
            onChange={this.onChangeConfirmPassword}
            fullWidth
          />
          <div className={styles.actions}>
            <Button primary submit disabled={!this.canRegister()}>
              Register
            </Button>
          </div>
        </form>
      );
    } else {
      return null;
    }
  }

  render() {
    return (
      <div className={styles.login}>
        <Tabs onChange={this.onChangeTabs} active={this.state.activeTabId}>
          <Tab value={tabEnum.LOGIN}>Login</Tab>
          <Tab value={tabEnum.REGISTER}>Register</Tab>
        </Tabs>
        {this.renderLogin()}
        {this.renderRegister()}
      </div>
    );
  }
}

Login.propTypes = {
  dispatch: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  onSuccess: PropTypes.func
};

export default Login;

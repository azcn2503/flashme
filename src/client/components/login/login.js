import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classNames from "classnames";

import { USER_PROPTYPE } from "client/proptypes";
import { login, register } from "client/state/actions/user";
import TextField from "client/components/textfield/textfield";
import Button from "client/components/button/button";
import Tabs from "client/components/tabs/tabs";
import Tab from "client/components/tab/tab";
import Tooltip from "client/components/tooltip/tooltip";

import styles from "./login.scss";

const tabEnum = {
  LOGIN: "LOGIN",
  REGISTER: "REGISTER"
};

class Login extends PureComponent {
  static mapStateToProps(state) {
    return {
      user: state.user
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      activeTabId: tabEnum.LOGIN,
      loginError: null,
      registerError: null
    };
    this.onChangeUsername = this.onChangeUsername.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangeConfirmPassword = this.onChangeConfirmPassword.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onSubmitLoginForm = this.onSubmitLoginForm.bind(this);
    this.onSubmitRegisterForm = this.onSubmitRegisterForm.bind(this);
    this.onChangeLoginForm = this.onChangeLoginForm.bind(this);
    this.onChangeRegisterForm = this.onChangeRegisterForm.bind(this);
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

  onChangeLoginForm() {
    this.setState({
      loginError: null
    });
  }

  onChangeRegisterForm() {
    this.setState({
      registerError: null
    });
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
    return (
      this.state.username !== "" &&
      this.state.password !== "" &&
      this.state.activeTabId === tabEnum.LOGIN
    );
  }

  canRegister() {
    return (
      this.state.username !== "" &&
      this.state.password !== "" &&
      this.state.confirmPassword !== "" &&
      this.state.email !== "" &&
      this.state.password === this.state.confirmPassword &&
      this.state.activeTabId === tabEnum.REGISTER
    );
  }

  submitLoginForm(registerOverride = false) {
    if (registerOverride || this.canLogin()) {
      this.props
        .dispatch(login(this.state.username, this.state.password))
        .then(() => {
          if (this.props.onLoginSuccess) {
            this.props.onLoginSuccess();
          }
        })
        .catch(err => {
          this.setState({
            loginError:
              "Unable to login, please check your details and try again"
          });
        });
    }
  }

  submitRegisterForm() {
    if (this.canRegister()) {
      this.props
        .dispatch(
          register(this.state.username, this.state.password, this.state.email)
        )
        .then(user => {
          this.submitLoginForm(true);
        })
        .catch(err => {
          this.setState({
            registerError: `Unable to register: ${err.message}`
          });
        });
    }
  }

  renderLogin() {
    if (this.state.activeTabId === tabEnum.LOGIN) {
      return (
        <form
          className={styles.form}
          onChange={this.onChangeLoginForm}
          onSubmit={this.onSubmitLoginForm}
        >
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
          <div className={styles.errors}>{this.state.loginError}</div>
          <div className={styles.actions}>
            <Tooltip
              message="Log in with a username and password"
              disabled={this.canLogin()}
            >
              <Button
                primary
                submit
                disabled={this.props.user.requesting || !this.canLogin()}
              >
                Log in
              </Button>
            </Tooltip>
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
        <form
          className={styles.form}
          onChange={this.onChangeRegisterForm}
          onSubmit={this.onSubmitRegisterForm}
        >
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
          <div className={styles.errors}>{this.state.registerError}</div>
          <div className={styles.actions}>
            <Tooltip
              message="Registration requires all fields to be filled in"
              disabled={this.canRegister()}
            >
              <Button
                primary
                submit
                disabled={this.props.user.requesting || !this.canRegister()}
              >
                Register
              </Button>
            </Tooltip>
          </div>
        </form>
      );
    } else {
      return null;
    }
  }

  render() {
    return (
      <div className={classNames(styles.login, this.props.className)}>
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
  className: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  onLoginSuccess: PropTypes.func,
  user: USER_PROPTYPE
};

export default connect(Login.mapStateToProps)(Login);

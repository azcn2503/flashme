import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import { login } from "client/state/actions/user";

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
    this.props.dispatch(login(this.state.username, this.state.password));
  }

  render() {
    return (
      <div className={styles.login}>
        <div>
          Username:{" "}
          <input
            type="text"
            defaultValue={this.state.username}
            onChange={this.onChangeUsername}
          />
        </div>
        <div>
          Password:{" "}
          <input
            type="password"
            defaultValue={this.state.password}
            onChange={this.onChangePassword}
          />
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  dispatch: PropTypes.func.isRequired
};

export default Login;

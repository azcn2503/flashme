import React, { PureComponent } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";

import { logout } from "client/state/actions/user";
import Login from "client/components/login/login";
import {
  SUBJECTS_PROPTYPE,
  CARDS_PROPTYPE,
  TESTS_PROPTYPE,
  USER_PROPTYPE
} from "../../proptypes";
import Button from "../button/button";

import styles from "./navigation.scss";

class Navigation extends PureComponent {
  static mapStateToProps(state) {
    return {
      cards: state.cards,
      subjects: state.subjects,
      tests: state.tests,
      user: state.user
    };
  }

  constructor(props) {
    super(props);
    this.onLoginSuccess = this.onLoginSuccess.bind(this);
    this.onClickLoginOrRegister = this.onClickLoginOrRegister.bind(this);
    this.onClickLogout = this.onClickLogout.bind(this);
  }

  onClickLoginOrRegister() {
    this.props.showDialog(
      "Login / Register",
      <Login className={styles.login} onLoginSuccess={this.onLoginSuccess} />
    );
  }

  onClickLogout() {
    this.props.dispatch(logout()).then(() => {
      this.props.history.push("/");
    });
  }

  onLoginSuccess() {
    this.props.onLoginSuccess();
  }

  /**
   * Build a link
   * @param {array} splitPath
   * @param {array} splitUrl
   * @param {number} index
   * @param {string} text
   * @param {string} segmentOverride
   */
  buildLink(splitPath, splitUrl, index, text, segmentOverride) {
    const url = [
      ...splitUrl.slice(0, index + (segmentOverride ? 0 : 1)),
      segmentOverride
    ].join("/");
    return <Link to={url}>{text}</Link>;
  }

  /**
   * Render a loading message for the state object
   * @param {object} obj
   */
  renderLoadingMessage(obj) {
    if (obj.allIds.length === 0 && obj.requesting) {
      return "Loading...";
    } else {
      return null;
    }
  }

  renderSegment(splitPath, splitUrl, index) {
    const path = splitPath[index];
    const url = splitUrl[index];
    switch (path) {
      case "subject":
      case "subjects":
        return this.buildLink(
          splitPath,
          splitUrl,
          index,
          "Subjects",
          "subjects"
        );
      case ":subjectId":
        const subject = this.props.subjects.byId[url];
        if (subject) {
          return this.buildLink(splitPath, splitUrl, index, subject.title);
        } else {
          return this.renderLoadingMessage(this.props.subjects);
        }
      case "test":
      case "tests":
        return this.buildLink(splitPath, splitUrl, index, "Tests", "tests");
      case ":testId":
        const test = this.props.tests.byId[url];
        if (test) {
          return this.buildLink(splitPath, splitUrl, index, test.id);
        } else {
          return this.renderLoadingMessage(this.props.tests);
        }
      default:
        return null;
    }
  }

  renderSeparator(index, length) {
    if (index < length - 1) {
      return <div key={index}>&gt;</div>;
    } else {
      return null;
    }
  }

  renderRoute() {
    const { path, url } = this.props.routerProps.match;
    const splitPath = path.split("/");
    const splitUrl = url.split("/");
    return splitPath.map((p, key) => [
      <div key={`segment-${key}`}>
        {this.renderSegment(splitPath, splitUrl, key)}
      </div>,
      key > 0 && key < splitPath.length - 1 ? (
        <div key={`separator-${key}`}>&gt;</div>
      ) : null
    ]);
  }

  renderUser() {
    if (this.props.user.loggedIn) {
      return (
        <div className={styles.userActions}>
          <div className={styles.currentUser}>
            Logged in as <strong>{this.props.user.currentUser.username}</strong>
          </div>
          <Button
            onClick={this.onClickLogout}
            disabled={this.props.user.requesting}
          >
            Logout
          </Button>
        </div>
      );
    } else {
      return (
        <div className={styles.login}>
          <Button
            onClick={this.onClickLoginOrRegister}
            disabled={this.props.user.requesting}
          >
            Login / Register
          </Button>
        </div>
      );
    }
  }

  render() {
    return (
      <div className={styles.navigation}>
        <div className={styles.route}>{this.renderRoute()}</div>
        {this.renderUser()}
      </div>
    );
  }
}

Navigation.propTypes = {
  cards: CARDS_PROPTYPE,
  subjects: SUBJECTS_PROPTYPE,
  tests: TESTS_PROPTYPE,
  user: USER_PROPTYPE,
  routerProps: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func
  }),
  onLoginSuccess: PropTypes.func,
  showDialog: PropTypes.func
};

export default withRouter(connect(Navigation.mapStateToProps)(Navigation));

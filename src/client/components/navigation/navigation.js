import React, { PureComponent } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { isEqual } from "lodash";

import { login } from "client/state/actions/user";
import Dialog from "client/components/dialog/dialog";
import Login from "client/components/login/login";
import {
  SUBJECTS_PROPTYPE,
  CARDS_PROPTYPE,
  TESTS_PROPTYPE
} from "../../proptypes";
import Button from "../button/button";

import styles from "./navigation.scss";

class Navigation extends PureComponent {
  static mapStateToProps(state) {
    return {
      cards: state.cards,
      subjects: state.subjects,
      tests: state.tests
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      loginDialogOpen: false,
      loginActions: null
    };
    this._login = null;
    this.onClickLoginOrRegister = this.onClickLoginOrRegister.bind(this);
    this.onCloseLoginDialog = this.onCloseLoginDialog.bind(this);
    this.onSubmitLogin = this.onSubmitLogin.bind(this);
  }

  onClickLoginOrRegister() {
    this.setState({
      loginDialogOpen: true
    });
  }

  onCloseLoginDialog() {
    this.setState({
      loginDialogOpen: false
    });
  }

  onSubmitLogin() {}

  onLoginSuccess() {
    this.setState({
      loginDialogOpen: false
    });
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

  render() {
    return (
      <div className={styles.navigation}>
        <div className={styles.route}>{this.renderRoute()}</div>
        <div className={styles.login}>
          <Button onClick={this.onClickLoginOrRegister}>
            Login / Register
          </Button>
        </div>
        <Dialog
          open={this.state.loginDialogOpen}
          onClose={this.onCloseLoginDialog}
          header="Login / Register"
          body={
            <Login
              ref={el => (this._login = el)}
              dispatch={this.props.dispatch}
            />
          }
        />
      </div>
    );
  }
}

Navigation.propTypes = {
  cards: CARDS_PROPTYPE,
  subjects: SUBJECTS_PROPTYPE,
  tests: TESTS_PROPTYPE,
  routerProps: PropTypes.object,
  dispatch: PropTypes.func.isRequired
};

export default connect(Navigation.mapStateToProps)(Navigation);

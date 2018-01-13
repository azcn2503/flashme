import React, { PureComponent } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";

import { logout } from "client/state/actions/user";
import { getSubjectFilteredTests } from "client/state/reducers/tests";
import { getSubjectFilteredCards } from "client/state/reducers/cards";
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

  onClickCardsButton(subjectId) {
    this.props.history.push(`/subject/${subjectId}`);
  }

  onClickTestsButton(subjectId) {
    this.props.history.push(`/subject/${subjectId}/tests`);
  }

  onLoginSuccess() {
    this.props.onLoginSuccess();
    this.props.hideDialog();
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

  renderSubjectLink() {
    const { subjectId } = this.props.routerProps.match.params;
    const subject = this.props.subjects.byId[subjectId];
    if (subject) {
      return <Link to={`/subject/${subjectId}`}>{subject.title}</Link>;
    } else {
      return this.renderLoadingMessage(this.props.subjects);
    }
  }

  renderSubjectsLink() {
    return <Link to="/subjects">Subjects</Link>;
  }

  renderTestLink() {
    const { subjectId, testId } = this.props.routerProps.match.params;
    const test = this.props.tests.byId[testId];
    if (test) {
      return <Link to={`/subject/${subjectId}/test/${testId}`}>Test</Link>;
    } else {
      return this.renderLoadingMessage(this.props.tests);
    }
  }

  renderTestsLink() {
    const { subjectId } = this.props.routerProps.match.params;
    const subject = this.props.subjects.byId[subjectId];
    if (subject) {
      return <Link to={`/subject/${subjectId}/tests`}>Tests</Link>;
    } else {
      return this.renderLoadingMessage(this.props.subjects);
    }
  }

  renderSegment(splitPath, splitUrl, index) {
    const path = splitPath[index];
    const url = splitUrl[index];
    switch (path) {
      case "subject":
      case "subjects":
        return this.renderSubjectsLink();
      case ":subjectId":
        return this.renderSubjectLink();
      case "test":
      case "tests":
        return this.renderTestsLink();
      case ":testId":
        return this.renderTestLink();
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
            ghost
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
            ghost
            onClick={this.onClickLoginOrRegister}
            disabled={this.props.user.requesting}
          >
            Login / Register
          </Button>
        </div>
      );
    }
  }

  renderContextualActions() {
    const { routerProps } = this.props;
    const { subjectId, testId } = routerProps.match.params;
    switch (routerProps.match.path) {
      case "/subject/:subjectId":
        return (
          <Button onClick={() => this.onClickTestsButton(subjectId)}>
            Tests ({getSubjectFilteredTests(this.props.tests, subjectId).length})
          </Button>
        );
      // case "/subject/:subjectId/tests":
      //   return (
      //     <Button onClick={() => this.onClickCardsButton(subjectId)}>
      //       Cards ({getSubjectFilteredCards(this.props.cards, subjectId).length})
      //     </Button>
      //   );
    }
  }

  render() {
    return (
      <div className={styles.navigation}>
        <div className={styles.route}>{this.renderRoute()}</div>
        <div className={styles.contextualActions}>
          {this.renderContextualActions()}
        </div>
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
  routerProps: PropTypes.shape({
    match: PropTypes.object
  }),
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func
  }),
  onLoginSuccess: PropTypes.func,
  showDialog: PropTypes.func,
  hideDialog: PropTypes.func
};

export default withRouter(connect(Navigation.mapStateToProps)(Navigation));

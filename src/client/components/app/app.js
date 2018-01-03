import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Switch, Route, Redirect } from "react-router-dom";

import TooltipElement from "client/components/tooltip-element/tooltip-element";
import SubjectCards from "client/components/subject-cards/subject-cards";
import Navigation from "client/components/navigation/navigation";
import Subjects from "client/components/subjects/subjects";
import SubjectTests from "client/components/subject-tests/subject-tests";
import Test from "client/components/test/test";
import Subheader from "client/components/subheader/subheader";
import Login from "client/components/login/login";
import { getCurrentUser } from "client/state/actions/user";
import { resetSubjects } from "client/state/actions/subjects";
import { resetCards } from "client/state/actions/cards";
import { resetTests } from "client/state/actions/tests";
import { USER_PROPTYPE } from "client/proptypes";

import styles from "./app.scss";

class App extends PureComponent {
  static mapStateToProps(state) {
    return {
      user: state.user
    };
  }

  constructor(props) {
    super(props);
    this.renderSubjects = this.renderSubjects.bind(this);
    this.renderSubjectCards = this.renderSubjectCards.bind(this);
    this.renderTest = this.renderTest.bind(this);
    this.renderNavigation = this.renderNavigation.bind(this);
    this.renderWelcome = this.renderWelcome.bind(this);
  }

  componentWillMount() {
    if (!this.props.user.loggedIn) {
      this.props.dispatch(getCurrentUser());
    }
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.user.loggedIn !== this.props.user.loggedIn &&
      !this.props.user.loggedIn
    ) {
      this.props.dispatch(resetSubjects());
      this.props.dispatch(resetCards());
      this.props.dispatch(resetTests());
    }
  }

  renderSubjects() {
    return <Subjects />;
  }

  renderSubjectCards(routerProps) {
    const { subjectId } = routerProps.match.params;
    return <SubjectCards subjectId={subjectId} />;
  }

  renderSubjectTests(routerProps) {
    const { subjectId } = routerProps.match.params;
    return <SubjectTests subjectId={subjectId} />;
  }

  renderTest(routerProps) {
    const { subjectId, testId } = routerProps.match.params;
    return <Test subjectId={subjectId} testId={testId} />;
  }

  renderNavigation(routerProps) {
    return <Navigation routerProps={routerProps} />;
  }

  renderLoggedInContent() {
    return (
      <Switch>
        <Route path="/subjects" component={this.renderSubjects} exact />
        <Route
          path="/subject/:subjectId/test/:testId"
          component={this.renderTest}
          exact
        />
        <Route
          path="/subject/:subjectId/tests"
          component={this.renderSubjectTests}
          exact
        />
        <Route
          path="/subject/:subjectId"
          component={this.renderSubjectCards}
          exact
        />
        <Route path="/" component={this.renderWelcome} exact />
        <Redirect to="/subjects" />
      </Switch>
    );
  }

  renderWelcome() {
    if (!this.props.user.loggedIn) {
      return (
        <div className={styles.content}>
          <div className={styles.notLoggedIn}>
            <Subheader label="Welcome to FlashMe!" />
            <div className={styles.appDescription}>
              <p>A flash card app.</p>
              <p>
                Please login or register to start creating subjects, cards and
                tests.
              </p>
            </div>
            <Login className={styles.login} />
          </div>
        </div>
      );
    } else {
      this.props.history.push("/subjects");
      return null;
    }
  }

  render() {
    return (
      <div className={styles.app}>
        <Switch>
          <Route path="/subjects" component={this.renderNavigation} exact />
          <Route
            path="/subject/:subjectId"
            component={this.renderNavigation}
            exact
          />
          <Route
            path="/subject/:subjectId/tests"
            component={this.renderNavigation}
            exact
          />
          <Route
            path="/subject/:subjectId/test/:testId"
            component={this.renderNavigation}
            exact
          />
          <Route
            path="/subject/:subjectId/tests"
            component={this.renderNavigation}
            exact
          />
          <Route component={this.renderNavigation} />
        </Switch>
        {this.renderLoggedInContent()}
        <TooltipElement />
      </div>
    );
  }
}

App.propTypes = {
  dispatch: PropTypes.func,
  user: USER_PROPTYPE,
  history: PropTypes.shape({
    push: PropTypes.func
  })
};

export default connect(App.mapStateToProps)(App);

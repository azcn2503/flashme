import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Switch, Route, Redirect } from "react-router-dom";

import Dialog from "client/components/dialog/dialog";
import TooltipElement from "client/components/tooltip-element/tooltip-element";
import SubjectCards from "client/components/subject-cards/subject-cards";
import Navigation from "client/components/navigation/navigation";
import Subjects from "client/components/subjects/subjects";
import SubjectTests from "client/components/subject-tests/subject-tests";
import Test from "client/components/test/test";
import Subheader from "client/components/subheader/subheader";
import Login from "client/components/login/login";
import Toast from "client/components/toast/toast";
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
    this.state = {
      dialogOpen: false,
      dialogHeader: null,
      dialogBody: null,
      dialogFooter: null
    };
    this.renderSubjects = this.renderSubjects.bind(this);
    this.renderSubjectCards = this.renderSubjectCards.bind(this);
    this.renderSubjectTests = this.renderSubjectTests.bind(this);
    this.renderTest = this.renderTest.bind(this);
    this.renderNavigation = this.renderNavigation.bind(this);
    this.renderWelcome = this.renderWelcome.bind(this);
    this.onLoginSuccess = this.onLoginSuccess.bind(this);
    this.showDialog = this.showDialog.bind(this);
    this.hideDialog = this.hideDialog.bind(this);
  }

  componentWillMount() {
    if (!this.props.user.loggedIn) {
      this.props
        .dispatch(getCurrentUser())
        .then(() => {
          if (this.props.history.location.pathname === "/") {
            this.props.history.push("/subjects");
          }
        })
        .catch(() => this.props.history.push("/"));
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.user.loggedIn !== this.props.user.loggedIn) {
      if (!this.props.user.loggedIn) {
        this.props.dispatch(resetSubjects());
        this.props.dispatch(resetCards());
        this.props.dispatch(resetTests());
      }
    }
  }

  showDialog(header, body, footer, props = {}) {
    this.setState({
      dialogOpen: true,
      dialogHeader: header,
      dialogBody: body,
      dialogFooter: footer,
      dialogProps: props
    });
  }

  hideDialog() {
    this.setState({
      dialogOpen: false
    });
  }

  onLoginSuccess() {
    this.props.history.push("/subjects");
  }

  renderSubjects() {
    return (
      <Subjects showDialog={this.showDialog} hideDialog={this.hideDialog} />
    );
  }

  renderSubjectCards(routerProps) {
    const { subjectId } = routerProps.match.params;
    return (
      <SubjectCards
        subjectId={subjectId}
        showDialog={this.showDialog}
        hideDialog={this.hideDialog}
      />
    );
  }

  renderSubjectTests(routerProps) {
    const { subjectId } = routerProps.match.params;
    return (
      <SubjectTests
        subjectId={subjectId}
        showDialog={this.showDialog}
        hideDialog={this.hideDialog}
      />
    );
  }

  renderTest(routerProps) {
    const { subjectId, testId } = routerProps.match.params;
    return (
      <Test
        subjectId={subjectId}
        testId={testId}
        showDialog={this.showDialog}
        hideDialog={this.hideDialog}
      />
    );
  }

  renderNavigation(routerProps) {
    return (
      <Navigation
        routerProps={routerProps}
        onLoginSuccess={this.onLoginSuccess}
        showDialog={this.showDialog}
        hideDialog={this.hideDialog}
      />
    );
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
            <Login
              className={styles.login}
              onLoginSuccess={this.onLoginSuccess}
            />
          </div>
        </div>
      );
    } else {
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
        <Dialog
          open={this.state.dialogOpen}
          showDialog={this.showDialog}
          hideDialog={this.hideDialog}
          header={this.state.dialogHeader}
          body={this.state.dialogBody}
          footer={this.state.dialogFooter}
          {...this.state.dialogProps}
        />
        <Toast />
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

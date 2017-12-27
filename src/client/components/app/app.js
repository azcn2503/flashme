import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Switch, Route, Redirect } from "react-router-dom";

import Dialog from "client/components/dialog/dialog";
import Cards from "client/components/cards/cards";
import Navigation from "client/components/navigation/navigation";
import Subjects from "client/components/subjects/subjects";
import Test from "client/components/test/test";

import styles from "./app.scss";

class App extends PureComponent {
  constructor(props) {
    super(props);
    this.renderCards = this.renderCards.bind(this);
    this.renderSubjects = this.renderSubjects.bind(this);
    this.renderSubjectCards = this.renderSubjectCards.bind(this);
    this.renderTest = this.renderTest.bind(this);
    this.renderNavigation = this.renderNavigation.bind(this);
  }

  renderCards() {
    return <Cards />;
  }

  renderSubjects() {
    return <Subjects />;
  }

  renderSubjectCards(routerProps) {
    const { subjectId } = routerProps.match.params;
    return <Cards subjectId={subjectId} />;
  }

  renderTest(routerProps) {
    const { testId } = routerProps.match.params;
    return <Test testId={testId} />;
  }

  renderNavigation(routerProps) {
    return <Navigation routerProps={routerProps} />;
  }

  render() {
    return (
      <div className={styles.app}>
        <Switch>
          <Route path="/subjects" component={this.renderNavigation} />
          <Route path="/subject/:subjectId" component={this.renderNavigation} />
          <Route
            path="/subject/:subjectId/tests"
            component={this.renderNavigation}
          />
          <Route
            path="/subject/:subjectId/test/:testId"
            component={this.renderNavigation}
          />
        </Switch>
        <Switch>
          <Route path="/subjects" component={this.renderSubjects} exact />
          <Route
            path="/subject/:subjectId"
            component={this.renderSubjectCards}
            exact
          />
          <Route
            path="/subject/:subjectId/test/:testId"
            component={this.renderTest}
            exact
          />
          <Redirect to="/subjects" />
        </Switch>
        <Dialog />
      </div>
    );
  }
}

App.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func
  })
};

export default App;

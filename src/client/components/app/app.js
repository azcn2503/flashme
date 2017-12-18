import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Switch, Route, Redirect } from "react-router-dom";

import Cards from "../cards/cards";
import Navigation from "../navigation/navigation";
import Subjects from "../subjects/subjects";
import Test from "../test/test";

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
    return <Cards dispatch={this.props.dispatch} />;
  }

  renderSubjects() {
    return <Subjects dispatch={this.props.dispatch} />;
  }

  renderSubjectCards(routerProps) {
    const { subjectId } = routerProps.match.params;
    return <Cards dispatch={this.props.dispatch} subjectId={subjectId} />;
  }

  renderTest(routerProps) {
    const { testId } = routerProps.match.params;
    return <Test testId={testId} />;
  }

  renderNavigation(routerProps) {
    return (
      <Navigation dispatch={this.props.dispatch} routerProps={routerProps} />
    );
  }

  render() {
    return (
      <div className={styles.app}>
        <Switch>
          <Route path="/subject/:subjectId" component={this.renderNavigation} />
          <Route component={this.renderNavigation} />
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
        </Switch>
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

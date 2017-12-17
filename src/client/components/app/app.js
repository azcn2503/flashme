import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Switch, Route, Redirect } from "react-router-dom";

import Cards from "../cards/cards";
import Navigation from "../navigation/navigation";
import SubjectTest from "../subject-test/subject-test";

import styles from "./app.scss";

class App extends PureComponent {
  constructor(props) {
    super(props);
    this.renderCards = this.renderCards.bind(this);
    this.renderSubjectCards = this.renderSubjectCards.bind(this);
    this.renderSubjectTestCards = this.renderSubjectTestCards.bind(this);
    this.renderNavigation = this.renderNavigation.bind(this);
  }

  renderCards() {
    return <Cards dispatch={this.props.dispatch} />;
  }

  renderSubjectCards(routerProps) {
    const { subjectId } = routerProps.match.params;
    return <Cards dispatch={this.props.dispatch} subjectId={subjectId} />;
  }

  renderSubjectTestCards(routerProps) {
    const { subjectId, testId } = routerProps.match.params;
    return (
      <Cards
        subjectId={subjectId}
        testId={testId}
        dispatch={this.props.dispatch}
      />
    );
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
          <Route
            path="/subject/:subjectId/view"
            component={this.renderSubjectCards}
            exact
          />
          <Route
            path="/subject/:subjectId/test/:testId"
            component={this.renderSubjectTestCards}
            exact
          />
          <Route path="/tests" component={this.renderTests} exact />
        </Switch>
      </div>
    );
  }
}

App.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func
  })
};

export default App;

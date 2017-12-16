import React, { PureComponent } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Switch, Route, Redirect } from "react-router-dom";

import Cards from "../cards/cards";
import Navigation from "../navigation/navigation";
import SubjectTest from "../subject-test/subject-test";

import styles from "./app.scss";

class App extends PureComponent {
  static mapStateToProps(state) {
    return {
      cards: state.cards.cards,
      subjects: state.subjects.subjects
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      routerAction: null
    };
    this.renderCards = this.renderCards.bind(this);
    this.renderSubjectCards = this.renderSubjectCards.bind(this);
    // this.renderSubjectTestCards = this.renderSubjectTestCards.bind(this);
    this.renderNewSubjectTest = this.renderNewSubjectTest.bind(this);
    this.renderNavigation = this.renderNavigation.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.routerAction !== prevState.routerAction &&
      this.state.routerAction !== null
    ) {
      this.state.routerAction();
      this.setState({
        routerAction: null
      });
    }
  }

  renderCards() {
    return <Cards dispatch={this.props.dispatch} />;
  }

  renderSubjectCards(routerProps) {
    const { subjectId } = routerProps.match.params;
    if (this.props.subjects.find(subject => subject.id === subjectId)) {
      return <Cards dispatch={this.props.dispatch} subjectId={subjectId} />;
    } else {
      this.props.history.push("/cards");
      return null;
    }
  }

  // renderSubjectTestCards(routerProps) {
  //   const { subjectId } = routerProps.match.params;
  //   return <Cards cards={this.getSubjectCards(subjectId)} test />;
  // }

  renderNewSubjectTest(routerProps) {
    const { subjectId } = routerProps.match.params;
    return <SubjectTest action={this.addSubjectTest} subjectId={subjectId} />;
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
          <Route path="/cards" component={this.renderNavigation} />
          <Route path="/subject/:id" component={this.renderNavigation} />
          <Route component={this.renderNavigation} />
        </Switch>
        <Switch>
          <Route path="/cards" component={this.renderCards} exact />
          <Route
            path="/subject/:subjectId/view"
            component={this.renderSubjectCards}
            exact
          />
          <Route
            path="/subject/:subjectId/test"
            component={this.renderNewSubjectTest}
            exact
          />
          {/* <Route
            path="/subject/:subjectId/test/:testId"
            component={this.renderSubjectTestCards}
            exact
          /> */}
          <Route path="/tests" component={this.renderTests} exact />
          <Redirect from="*" to="/cards" />
        </Switch>
      </div>
    );
  }
}

App.propTypes = {
  cards: PropTypes.array,
  subjects: PropTypes.array,
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func
  })
};

export default connect(App.mapStateToProps)(App);

import React, { PureComponent } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Switch, Route, Redirect } from "react-router-dom";

import Cards from "../cards/cards";
import Navigation from "../navigation/navigation";
import SubjectTest from "../subject-test/subject-test";

import { addCard, removeCard, updateCard } from "../../state/actions/cards";

import styles from "./app.scss";

class App extends PureComponent {
  static mapStateToProps(state) {
    return {
      cards: state.cards,
      subjects: state.subjects
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      routerAction: null
    };
    this.renderCards = this.renderCards.bind(this);
    this.renderSubjectCards = this.renderSubjectCards.bind(this);
    this.renderSubjectTestCards = this.renderSubjectTestCards.bind(this);
    this.renderNewSubjectTest = this.renderNewSubjectTest.bind(this);
    this.renderNavigation = this.renderNavigation.bind(this);
    this.addSubject = this.addSubject.bind(this);
    this.addSubjectTest = this.addSubjectTest.bind(this);
    this.removeSubject = this.removeSubject.bind(this);
    this.updateSubject = this.updateSubject.bind(this);
    this.addCard = this.addCard.bind(this);
    this.removeCard = this.removeCard.bind(this);
    this.updateCard = this.updateCard.bind(this);
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

  addCard(card, subjectId) {
    this.props.dispatch(addCard(Object.assign({}, card, { subjectId })));
  }

  addSubject(subject) {
    this.setState({
      subjects: [
        ...this.state.subjects,
        Object.assign({}, subject, { tests: [] })
      ]
    });
  }

  addSubjectTest(subjectId) {
    if (this.state.subjects.find(subject => subject.id === subjectId)) {
      this.setState({
        routerAction: () =>
          this.props.history.push(
            `/subject/${subjectId}/test/${
              this.state.subjects.find(subject => subject.id === subjectId)
                .tests.length
            }`
          ),
        subjects: this.state.subjects.map(subject => {
          if (subject.id === subjectId) {
            return {
              ...subject,
              tests: [
                ...subject.tests,
                {
                  cards: [
                    ...this.state.cards.filter(
                      card => card.subjectId === subjectId
                    )
                  ]
                }
              ]
            };
          } else {
            return subject;
          }
        })
      });
    }
  }

  updateCard(index, card) {
    this.props.dispatch(updateCard(index, card));
  }

  updateSubject(index, subject) {
    this.setState({
      subjects: [
        ...this.state.subjects.slice(0, index),
        Object.assign({}, this.state.subjects[index], subject),
        ...this.state.subjects.slice(index + 1)
      ]
    });
  }

  removeCard(index) {
    this.setState({
      cards: [
        ...this.state.cards.slice(0, index),
        ...this.state.cards.slice(index + 1)
      ]
    });
  }

  removeSubject(index) {
    this.setState({
      subjects: [
        ...this.state.subjects.slice(0, index),
        ...this.state.subjects.slice(index + 1)
      ]
    });
  }

  getSelectedCards() {
    return this.state.cards.filter(card => card.selected);
  }

  getSubjectCards(subjectId) {
    return this.state.cards.filter(card => card.subjectId === subjectId);
  }

  renderCards() {
    return (
      <Cards
        cards={this.state.cards}
        addCard={this.addCard}
        removeCard={this.removeCard}
        selectCard={this.selectCard}
      />
    );
  }

  renderSubjectCards(routerProps) {
    const { subjectId } = routerProps.match.params;
    if (this.state.subjects.find(subject => subject.id === subjectId)) {
      return (
        <Cards
          cards={this.getSubjectCards(subjectId)}
          addCard={card => this.addCard(card, subjectId)}
          removeCard={card => this.removeCard(card, subjectId)}
          selectCard={this.selectCard}
        />
      );
    } else {
      this.props.history.push("/cards");
      return null;
    }
  }

  renderSubjectTestCards(routerProps) {
    const { subjectId } = routerProps.match.params;
    return (
      <Cards
        cards={this.getSubjectCards(subjectId)}
        addCard={card => this.addCard(card, subjectId)}
        removeCard={card => this.removeCard(card, subjectId)}
        test
      />
    );
  }

  renderNewSubjectTest(routerProps) {
    const { subjectId } = routerProps.match.params;
    return <SubjectTest action={this.addSubjectTest} subjectId={subjectId} />;
  }

  renderNavigation(routerProps) {
    return (
      <Navigation
        routerProps={routerProps}
        addCard={this.addCard}
        removeCard={this.removeCard}
        addSubject={this.addSubject}
        removeSubject={this.removeSubject}
        updateSubject={this.updateSubject}
      />
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
          <Route
            path="/subject/:subjectId/test/:testId"
            component={this.renderSubjectTestCards}
            exact
          />
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

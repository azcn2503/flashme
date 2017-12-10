import React, { PureComponent } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Subjects from '../subjects/subjects';
import Cards from '../cards/cards';
import Navigation from '../navigation/navigation';

import styles from './app.scss';

class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      subjects: [],
      cards: [],
      tests: []
    };
    this.renderCards = this.renderCards.bind(this);
    this.renderSubjectCards = this.renderSubjectCards.bind(this);
    this.renderNavigation = this.renderNavigation.bind(this);
    this.addSubject = this.addSubject.bind(this);
    this.removeSubject = this.removeSubject.bind(this);
    this.updateSubject = this.updateSubject.bind(this);
    this.addCard = this.addCard.bind(this);
    this.removeCard = this.removeCard.bind(this);
  }

  addCard(card, subjectId) {
    this.setState({
      cards: [
        ...this.state.cards,
        Object.assign({}, card, { subjectId })
      ]
    });
  }

  addSubject(subject) {
    this.setState({
      subjects: [
        ...this.state.subjects,
        subject
      ]
    });
  }

  updateSubject(index, subject) {
    this.setState({
      subjects: [
        ...this.state.subjects.slice(0, index),
        subject,
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

  renderCards(routerProps) {
    return (
      <Cards
        cards={this.state.cards}
        addCard={this.addCard}
        removeCard={this.removeCard}
      />
    );
  }

  renderSubjectCards(routerProps) {
    const subjectId = routerProps.match.params.id;
    const test = routerProps.match.params.type === 'test';
    return (
      <Cards
        cards={this.state.cards.filter(card => card.subjectId === subjectId)}
        addCard={card => this.addCard(card, subjectId)}
        removeCard={card => this.removeCard(card, subjectId)}
        test={test}
      />
    );
  }

  renderNavigation(routerProps) {
    return (
      <Navigation
        routerProps={routerProps}
        cards={this.state.cards}
        addCard={this.addCard}
        removeCard={this.removeCard}
        subjects={this.state.subjects}
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
          <Route
            path="/cards"
            component={this.renderNavigation}
          />
          <Route
            path="/subject/:id"
            component={this.renderNavigation}
          />
          <Route
            component={this.renderNavigation}
          />
        </Switch>
        <Switch>
          <Route path="/cards" component={this.renderCards} exact />
          <Route path="/subject/:id/:type" component={this.renderSubjectCards} exact />
          <Redirect from="*" to="/cards" />
        </Switch>
      </div>
    );
  }
}

export default App;

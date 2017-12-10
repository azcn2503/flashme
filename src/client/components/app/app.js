import React, { PureComponent } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Subjects from '../subjects/subjects';
import Cards from '../cards/cards';

import styles from './app.scss';

class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      subjects: [],
      cards: []
    };
    this.renderCards = this.renderCards.bind(this);
    this.renderSubjectCards = this.renderSubjectCards.bind(this);
    this.renderSubjectsPanel = this.renderSubjectsPanel.bind(this);
    this.addSubject = this.addSubject.bind(this);
    this.removeSubject = this.removeSubject.bind(this);
    this.addCard = this.addCard.bind(this);
    this.removeCard = this.removeCard.bind(this);
  }

  addCard(card) {
    this.setState({
      cards: [
        ...this.state.cards,
        card
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
    return this.renderCards();
    // return (
    //   <Cards cards={this.state.cards} />
    // );
  }

  renderSubjectsPanel(routerProps) {
    return (
      <Subjects
        subjects={this.state.subjects}
        activeId={routerProps.match.params.id}
        addSubject={this.addSubject}
        removeSubject={this.removeSubject}
      />
    );
  }

  render() {
    return (
      <div className={styles.app}>
        <Switch>
          <Route path="/subject/:id" component={this.renderSubjectsPanel} />
          <Route component={this.renderSubjectsPanel} />
        </Switch>
        <Switch>
          <Route path="/cards" component={this.renderCards} />
          <Route path="/subject/:id" component={this.renderSubjectCards} />
          <Redirect from="*" to="/cards" />
        </Switch>
      </div>
    );
  }
}

export default App;

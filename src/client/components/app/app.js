import React, { PureComponent } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Cards from "../cards/cards";
import Navigation from "../navigation/navigation";

import styles from "./app.scss";

class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      subjects: [],
      cards: []
    };
    this.renderCards = this.renderCards.bind(this);
    this.renderSubjectCards = this.renderSubjectCards.bind(this);
    this.renderSubjectTestCards = this.renderSubjectTestCards.bind(this);
    this.renderNavigation = this.renderNavigation.bind(this);
    this.addSubject = this.addSubject.bind(this);
    this.removeSubject = this.removeSubject.bind(this);
    this.updateSubject = this.updateSubject.bind(this);
    this.addCard = this.addCard.bind(this);
    this.removeCard = this.removeCard.bind(this);
    this.updateCard = this.updateCard.bind(this);
    this.selectCard = this.selectCard.bind(this);
  }

  addCard(card, subjectId) {
    this.setState({
      cards: [
        ...this.state.cards,
        Object.assign({}, card, { subjectId, selected: false })
      ]
    });
  }

  addSubject(subject) {
    this.setState({
      subjects: [...this.state.subjects, subject]
    });
  }

  updateCard(index, card) {
    this.setState({
      cards: [
        ...this.state.cards.slice(0, index),
        Object.assign({}, this.state.cards[index], card),
        ...this.state.cards.slice(index + 1)
      ]
    });
  }

  selectCard(index, selected) {
    const card = this.state.cards[index];
    this.updateCard(index, Object.assign({}, card, { selected }));
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
    const { id: subjectId } = routerProps.match.params;
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
    const { id: subjectId } = routerProps.match.params;
    return (
      <Cards
        cards={this.getSubjectCards(subjectId)}
        addCard={card => this.addCard(card, subjectId)}
        removeCard={card => this.removeCard(card, subjectId)}
        test
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
          <Route path="/cards" component={this.renderNavigation} />
          <Route path="/subject/:id" component={this.renderNavigation} />
          <Route component={this.renderNavigation} />
        </Switch>
        <Switch>
          <Route path="/cards" component={this.renderCards} exact />
          <Route
            path="/subject/:id/view"
            component={this.renderSubjectCards}
            exact
          />
          <Route
            path="/subject/:id/test"
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

export default App;

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
  }

  renderCards(routerProps) {
    return (
      <Cards cards={this.state.cards} />
    );
  }

  renderSubjectCards(routerProps) {
    return (
      <Cards cards={this.state.cards} />
    );
  }

  render() {
    return (
      <div className={styles.app}>
        <Subjects subjects={this.state.subjects} />
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

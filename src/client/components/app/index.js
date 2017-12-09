import React, { PureComponent } from 'react';

import Subjects from '../subjects/subjects';
import Cards from '../cards/cards';

import styles from './index.scss';

class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      subjects: [],
      cards: []
    };
  }

  render() {
    return (
      <div className={styles.app}>
        <Subjects subjects={this.state.subjects} />
        <Cards cards={this.state.cards} />
      </div>
    );
  }
}

export default App;

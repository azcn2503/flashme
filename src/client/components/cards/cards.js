import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import FlashCard from '../flash-card/flash-card';

import styles from './cards.scss';

class Cards extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showBothSides: false,
      testCard: 0
    };
    this.onClickShowBothSides = this.onClickShowBothSides.bind(this);
    this.onContinueTest = this.onContinueTest.bind(this);
  }

  componentDidUpdate(nextProps) {
    if (nextProps.test !== this.props.test && this.props.test) {
      this.setState({
        testCard: 0
      });
    }
  }

  onClickShowBothSides() {
    this.setState({
      showBothSides: !this.state.showBothSides
    });
  }

  onChangeCard(key, value) {
    console.log('Changing card', key, value);
    this.props.updateCard(key, value);
  }

  onSubmitCard(key, value) {
    if (!key) {
      console.log('Creating new card', value);
      this.props.addCard(value);
    } else {
      console.log('Updating existing card', key, value);
      this.props.updateCard(key, value);
    }
  }

  onContinueTest(status) {
    this.setState({
      testCard: this.state.testCard + 1
    });
  }

  renderTestContainer() {
    if (this.state.testCard < this.props.cards.length) {
      return (
        <div className={styles.testContainer}>
          <div className={styles.progressContainer}>
            <div className={styles.progressBar} style={{ width: `${Math.floor(100 / this.props.cards.length * (this.state.testCard + 1))}%` }} />
          </div>
          <div className={styles.testStatus}>
            Card {this.state.testCard + 1} of {this.props.cards.length}
          </div>
          <div className={styles.testCard}>
            <FlashCard
              question={this.props.cards[this.state.testCard].question}
              answer={this.props.cards[this.state.testCard].answer}
              onContinue={this.onContinueTest}
              test
            />
          </div>
        </div>
      );
    } else {
      return (
        <div>Doneded</div>
      );
    }
  }

  renderCardList() {
    return (
      <div className={styles.cardList}>
        <FlashCard
          onChange={value => this.onChangeCard(null, value)}
          onSubmit={value => this.onSubmitCard(null, value)}
          editable
          showBothSides={this.state.showBothSides}
        />
        {
          this.props.cards.map((card, key) => (
            <FlashCard
              key={key}
              question={card.question}
              answer={card.answer}
              showBothSides={this.state.showBothSides}
            />
          ))
        }
      </div>
    );
  }

  render() {
    return (
      <div className={styles.cards}>
        <div className={styles.controls}>
          <button onClick={this.onClickShowBothSides}>
            {this.state.showBothSides ? 'Show one side only' : 'Show both sides'}
          </button>
        </div>
        { this.props.test ? this.renderTestContainer() : this.renderCardList() }
      </div>
    );
  }
}

Cards.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.object).isRequired,
  addCard: PropTypes.func,
  updateCard: PropTypes.func,
  removeCard: PropTypes.func,
  test: PropTypes.bool
};

Cards.defaultProps = {
  addCard: () => null,
  updateCard: () => null,
  removeCard: () => null,
  test: false
};

export default Cards;

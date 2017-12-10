import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import FlashCard from '../flash-card/flash-card';

import styles from './cards.scss';

class Cards extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showBothSides: false
    };
    this.onClickShowBothSides = this.onClickShowBothSides.bind(this);
  }

  onClickShowBothSides() {
    this.setState({
      showBothSides: !this.state.showBothSides
    });
  }

  onChangeCard(key, value) {
    console.log("Changing card", value);
  }

  onSubmitCard(key, value) {
    if (!key) {
      console.log("Creating new card", value);
    } else {
      console.log("Updating existing card", value);
    }
  }

  render() {
    return (
      <div className={styles.cards}>
        <div className={styles.controls}>
          <button onClick={this.onClickShowBothSides}>
            {this.state.showBothSides ? "Show one side only" : "Show both sides"}
          </button>
        </div>
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
}

Cards.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.object),
  onChangeCard: PropTypes.func
};

Cards.defaultProps = {
  onChangeCard: () => null
};

export default Cards;

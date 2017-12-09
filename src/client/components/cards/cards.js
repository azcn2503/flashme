import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import FlashCard from '../flash-card/flash-card';

import styles from './cards.scss';

class Cards extends PureComponent {
  render() {
    return (
      <div className={styles.cards}>
        <FlashCard editable />
        {
          this.props.cards.map(card => (
            <FlashCard
              question={card.question}
              answer={card.answer}
            />
          ))
        }
      </div>
    );
  }
}

Cards.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.object)
};

export default Cards;

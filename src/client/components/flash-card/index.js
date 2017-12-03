import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './index.scss';

class FlashCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flipped: false
    };

    this.flip = this.flip.bind(this);
  }

  render() {
    return (
      <div className={classNames(styles.flashCard, {
        [styles.flipped]: this.state.flipped
      })}>
        <div className={styles.front}>
          Front
        </div>
        <div className={styles.back}>
          Back
        </div>
      </div>
    );
  }
}

export default FlashCard;

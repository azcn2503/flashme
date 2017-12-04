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

  flip() {
    this.setState({
      flipped: !this.state.flipped
    });
  }

  render() {
    return (
      <div className={classNames(styles.flashCard, {
        [styles.flipped]: this.state.flipped
      })}>
        <div className={classNames(styles.front, styles.face)}>
          {this.props.front}
        </div>
        <div className={classNames(styles.back, styles.face)}>
          {this.props.back}
        </div>
        <div className={styles.controls}>
          <button onClick={this.flip}>
            Flip
          </button>
        </div>
      </div>
    );
  }
}

export default FlashCard;

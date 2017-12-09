import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './flash-card.scss';

class FlashCard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      flipped: false,
      focused: false
    };
    this._question = null;
    this._answer = null;
    this.flip = this.flip.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onFocus = this.onFocus.bind(this);
  }

  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this._question && this._answer && prevState.flipped !== this.state.flipped) {
      if (this.state.flipped) {
        this._answer.focus();
      } else {
        this._question.focus();
      }
      document.execCommand('selectAll', null, false);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
  }

  onBlur() {
    this.setState({
      focused: false
    });
  }

  onFocus() {
    this.setState({
      focused: true
    });
  }

  onKeyDown(e) {
    if (this.state.focused && e.keyCode === 9) {
      e.preventDefault();
      this.flip();
    }
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
      })}
      >
        <div className={classNames(styles.front, styles.face)}>
          <div className={styles.faceTitle}>
            Question
          </div>
          <div
            className={styles.question}
            contentEditable={this.props.editable}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            ref={el => (this._question = el)}
          >
            {this.props.question}
          </div>
          <div className={styles.controls}>
            <button onClick={this.flip}>
              Show Answer
            </button>
          </div>
        </div>
        <div className={classNames(styles.back, styles.face)}>
          <div className={styles.faceTitle}>
            Answer
          </div>
          <div
            className={styles.answer}
            contentEditable={this.props.editable}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            ref={el => (this._answer = el)}
          >
            {this.props.answer}
          </div>
          <div className={styles.controls}>
            <button onClick={this.flip}>
              Show Question
            </button>
          </div>
        </div>
      </div>
    );
  }
}

FlashCard.propTypes = {
  question: PropTypes.string,
  answer: PropTypes.string,
  editable: PropTypes.bool
};

FlashCard.defaultProps = {
  question: '',
  answer: '',
  editable: false
};

export default FlashCard;

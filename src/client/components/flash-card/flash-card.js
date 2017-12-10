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
      if (this.props.editable) {
        document.execCommand('selectAll', null, false);
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
  }

  onBlur() {
    if (this.props.editable) {
      this.props.onChange(this.value());
      this.setState({
        focused: false
      });
    }
  }

  onFocus() {
    if (this.props.editable) {
      this.setState({
        focused: true
      });
    }
  }

  onKeyDown(e) {
    if (this.props.editable && this.state.focused) {
      if (e.keyCode === 9) {
        e.preventDefault();
        this.flip();
      }
      if (e.metaKey && e.keyCode === 13) {
        e.preventDefault();
        this.submit();
      }
    }
  }

  flip() {
    this.setState({
      flipped: !this.state.flipped
    });
  }

  submit() {
    this.props.onSubmit(this.value());
  }

  value() {
    const question = this._question.innerHTML;
    const answer = this._answer.innerHTML;
    return { question, answer };
  }

  render() {
    return (
      <div className={classNames(styles.flashCard, {
        [styles.flipped]: this.state.flipped,
        [styles.showBothSides]: this.props.showBothSides
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
            { this.props.editable ? null : this.props.question }
          </div>
          { !this.props.showBothSides ? (
            <div className={styles.controls}>
              <button onClick={this.flip}>
                Show Answer
              </button>
            </div>
          ) : null}
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
            { this.props.editable ? null : this.props.answer }
          </div>
          { !this.props.showBothSides ? (
            <div className={styles.controls}>
              <button onClick={this.flip}>
                Show Question
              </button>
            </div>
          ) : null }
        </div>
      </div>
    );
  }
}

FlashCard.propTypes = {
  question: PropTypes.string,
  answer: PropTypes.string,
  editable: PropTypes.bool,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  showBothSides: PropTypes.bool
};

FlashCard.defaultProps = {
  question: '',
  answer: '',
  editable: false,
  onChange: () => null,
  onSubmit: () => null,
  showBothSides: false
};

export default FlashCard;

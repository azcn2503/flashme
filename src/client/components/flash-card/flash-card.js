import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { CARD_PROPTYPE } from "../../proptypes";
import { addCard, updateCard, removeCard } from "../../state/actions/cards";
import Button from "../button/button";

import styles from "./flash-card.scss";

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
    this.onClick = this.onClick.bind(this);
    this.onClickFlip = this.onClickFlip.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
  }

  componentDidMount() {
    window.addEventListener("keydown", this.onKeyDown);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.test !== this.props.test) {
      this.setState({
        flipped: false
      });
    }
    if (
      this._question &&
      this._answer &&
      prevState.flipped !== this.state.flipped
    ) {
      if (this.state.flipped) {
        this._answer.focus();
      } else {
        this._question.focus();
      }
      if (this.props.editable) {
        document.execCommand("selectAll", null, false);
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.onKeyDown);
  }

  onChange(value) {
    console.log(value);
  }

  onClick(e) {
    e.preventDefault();
  }

  onClickDelete(e) {
    e.stopPropagation();
    this.props.dispatch(removeCard(this.props.card.id));
  }

  onClickFlip(e) {
    e.stopPropagation();
    this.flip();
  }

  onBlur() {
    if (this.props.editable) {
      this.onChange(this.value());
      this.setState({
        focused: false
      });
    }
  }

  onContinue(value) {
    this.flip();
    this.props.onContinue(this.props.card.id, value);
  }

  onFocus() {
    if (this.props.editable) {
      this.setState({
        focused: true
      });
    }
  }

  onKeyDown(e) {
    const modifierKey = e.metaKey || e.ctrlKey;
    if (this.props.test) {
      if (e.keyCode === 9) {
        // Tab
        if (this.state.flipped) {
          e.preventDefault();
          this.onContinue(false);
        } else {
          e.preventDefault();
          this.flip();
        }
      } else if (e.keyCode === 13) {
        // Enter
        if (this.state.flipped) {
          e.preventDefault();
          this.onContinue(true);
        }
      }
    } else if (this.props.editable && this.state.focused) {
      if (e.keyCode === 9) {
        e.preventDefault();
        this.flip();
      }
      if (modifierKey && e.keyCode === 13) {
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
    if (this.props.card.id) {
      // Update
      this.props.dispatch(updateCard(this.props.card.id, this.value()));
    } else {
      // Create
      this.props.dispatch(addCard(this.value(), this.props.subjectId));
    }
  }

  value() {
    const question = this._question.innerHTML;
    const answer = this._answer.innerHTML;
    return { question, answer };
  }

  getQuestionMarkup() {
    return {
      __html: this.props.card.question
    };
  }

  getAnswerMarkup() {
    if (!this.props.test || (this.props.test && this.state.flipped)) {
      return {
        __html: this.props.card.answer
      };
    } else {
      return null;
    }
  }

  renderTestButtons() {
    if (this.props.test) {
      return [
        <Button key={0} onClick={() => this.onContinue(true)} primary>
          Right
        </Button>,
        <Button key={1} onClick={() => this.onContinue(false)}>
          Wrong
        </Button>
      ];
    } else {
      return null;
    }
  }

  renderDeleteButton() {
    if (this.props.card.id) {
      return (
        <button className={styles.deleteButton} onClick={this.onClickDelete}>
          x
        </button>
      );
    } else {
      return null;
    }
  }

  renderFlipButton() {
    if (!this.props.showBothSides) {
      return <Button onClick={this.onClickFlip}>Flip</Button>;
    } else {
      return null;
    }
  }

  render() {
    return (
      <div
        className={classNames(styles.flashCard, {
          [styles.selected]: this.props.selected,
          [styles.animated]:
            !this.props.showBothSides ||
            (this.props.test && this.state.flipped),
          [styles.test]: this.props.test,
          [styles.editable]: this.props.editable,
          [styles.selectable]: !this.props.editable && !this.props.test,
          [styles.flipped]: this.state.flipped && !this.props.showBothSides,
          [styles.showBothSides]: this.props.showBothSides
        })}
        onClick={this.onClick}
      >
        <div className={classNames(styles.front, styles.face)}>
          <div className={styles.faceTitle}>Question</div>
          <div
            className={styles.question}
            contentEditable={this.props.editable}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            ref={el => (this._question = el)}
            dangerouslySetInnerHTML={this.getQuestionMarkup()}
          />
        </div>
        <div className={classNames(styles.back, styles.face)}>
          <div className={styles.faceTitle}>Answer</div>
          <div
            className={styles.answer}
            contentEditable={this.props.editable}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            ref={el => (this._answer = el)}
            dangerouslySetInnerHTML={this.getAnswerMarkup()}
          />
        </div>
        <div className={styles.controls}>
          {this.renderFlipButton()}
          {this.renderDeleteButton()}
          {this.renderTestButtons()}
        </div>
      </div>
    );
  }
}

FlashCard.propTypes = {
  card: CARD_PROPTYPE,
  editable: PropTypes.bool,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  onSelect: PropTypes.func,
  showBothSides: PropTypes.bool,
  test: PropTypes.bool,
  onContinue: PropTypes.func,
  selected: PropTypes.bool,
  dispatch: PropTypes.func
};

FlashCard.defaultProps = {
  question: "",
  answer: "",
  editable: false,
  onChange: () => null,
  onSubmit: () => null,
  onSelect: () => null,
  showBothSides: false,
  test: false,
  onContinue: () => null,
  selected: false
};

export default FlashCard;

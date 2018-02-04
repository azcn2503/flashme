import React, { PureComponent, Fragment } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { CARD_PROPTYPE } from "../../proptypes";
import { addCard, updateCard, removeCard } from "../../state/actions/cards";
import Button from "../button/button";
import EditableContent from "../editable-content/editable-content";
import Tooltip from "../tooltip/tooltip";
import Transition from "client/components/transition/transition";

import styles from "./flash-card.scss";

const faceEnum = {
  QUESTION: "QUESTION",
  ANSWER: "ANSWER"
};

const metaKey = window.navigator.platform.toLowerCase().includes("mac")
  ? "\u2318"
  : "Ctrl";

class FlashCard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      question: props.card.question || "",
      answer: props.card.answer || "",
      flipped: false,
      deleteDialogOpen: false,
      highlightUpdate: false,
      dirty: false
    };
    this._question = null;
    this._answer = null;
    this.flip = this.flip.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onChangeQuestion = this.onChangeQuestion.bind(this);
    this.onChangeAnswer = this.onChangeAnswer.bind(this);
    this.onKeyDownQuestion = this.onKeyDownQuestion.bind(this);
    this.onKeyDownAnswer = this.onKeyDownAnswer.bind(this);
    this.onClickFlip = this.onClickFlip.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
    this.onClickConfirmDelete = this.onClickConfirmDelete.bind(this);
    this.onClickCancelDelete = this.onClickCancelDelete.bind(this);
    this.onClickAddCard = this.onClickAddCard.bind(this);
    this.onClickUpdateCard = this.onClickUpdateCard.bind(this);
    this.onWindowKeyDown = this.onWindowKeyDown.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    // Highlight when the card is updated
    if (
      prevProps.card.id === this.props.card.id &&
      prevProps.card.updated !== this.props.card.updated
    ) {
      this.highlightUpdate();
    }

    // Reset flipped and dirty state when card changes
    if (prevProps.card.id !== this.props.card.id) {
      this.setState({
        flipped: false,
        dirty: false
      });
    }

    if (prevProps.card.updated !== this.props.card.updated) {
      this.setState({
        dirty: false
      });
    }

    // Mark as updated
    if (
      this.props.card.id &&
      prevProps.card.id === this.props.card.id &&
      (prevState.question !== this.state.question ||
        prevState.answer !== this.state.answer)
    ) {
      this.setState({
        dirty: true
      });
    }

    // Focus and select the question/answer when flipped
    if (
      this.props.editable &&
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

  componentWillMount() {
    window.addEventListener("keydown", this.onWindowKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.onWindowKeyDown);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.card.question !== this.props.card.question) {
      this.setState({ question: nextProps.card.question });
    }
    if (nextProps.card.answer !== this.props.card.answer) {
      this.setState({ answer: nextProps.card.answer });
    }
  }

  onWindowKeyDown(e) {
    if (this.props.test) {
      if (this.state.flipped) {
        if (e.keyCode === 13) {
          e.preventDefault();
          this.onAnswerTestCard(true);
        } else if (e.keyCode === 9) {
          e.preventDefault();
          this.onAnswerTestCard(false);
        }
      } else {
        if (e.keyCode === 9) {
          e.preventDefault();
          this.flip();
        }
      }
    }
  }

  onChangeQuestion(value) {
    this.setState({ question: value });
  }

  onChangeAnswer(value) {
    this.setState({ answer: value });
  }

  onClickDelete(e) {
    this.props.showDialog(
      "Delete card?",
      this.renderDeleteDialogBody(),
      this.renderDeleteDialogActions()
    );
  }

  onClickCancelDelete() {
    this.props.hideDialog();
  }

  onClickConfirmDelete() {
    this.props.dispatch(removeCard(this.props.card.id));
    this.props.hideDialog();
  }

  onClickFlip(e) {
    e.stopPropagation();
    this.flip();
  }

  onClickAddCard() {
    this.submit();
  }

  onClickUpdateCard() {
    this.submit();
  }

  onAnswerTestCard(value) {
    this.props.onAnswerTestCard(value);
  }

  onKeyDownQuestion(e) {
    this.onKeyDown(e, faceEnum.QUESTION);
  }

  onKeyDownAnswer(e) {
    this.onKeyDown(e, faceEnum.ANSWER);
  }

  onKeyDown(e, face) {
    const modifierKey = e.metaKey || e.ctrlKey;
    if (this.props.editable) {
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

  canSubmit() {
    return this.state.question !== "" && this.state.answer !== "";
  }

  canUpdate() {
    return (
      this.state.dirty &&
      !this.props.requesting &&
      this.state.question !== "" &&
      this.state.answer !== ""
    );
  }

  highlightUpdate() {
    this.setState({
      highlightUpdate: true
    });
    setTimeout(() => this.setState({ highlightUpdate: false }), 1000);
  }

  flip() {
    this.setState({
      flipped: !this.state.flipped
    });
  }

  submit() {
    if (this.props.card.id) {
      // Update
      if (this.canUpdate()) {
        this.props.dispatch(updateCard(this.props.card.id, this.value()));
      }
    } else {
      // Create
      if (this.canSubmit()) {
        this.props.dispatch(addCard(this.value(), this.props.subjectId));
        this.resetCard();
      }
    }
  }

  value() {
    const { question, answer } = this.state;
    return { question, answer };
  }

  resetCard() {
    this.setState(
      {
        question: "",
        answer: "",
        flipped: false
      },
      () => {
        if (this._question && this._answer) {
          Promise.all([
            this._question.resetHTML(),
            this._answer.resetHTML()
          ]).then(() => this._question.focus());
        }
      }
    );
  }

  renderTestButtons() {
    if (this.props.test && this.state.flipped) {
      return (
        <React.Fragment>
          <Tooltip message="Mark as correct (Enter)">
            <Button
              small
              onClick={() => this.onAnswerTestCard(true)}
              primary
              disabled={!!this.props.requesting}
            >
              Right
            </Button>
          </Tooltip>
          <Tooltip message="Mark as incorrect (Tab)">
            <Button
              small
              onClick={() => this.onAnswerTestCard(false)}
              disabled={!!this.props.requesting}
            >
              Wrong
            </Button>
          </Tooltip>
        </React.Fragment>
      );
    } else {
      return null;
    }
  }

  renderDeleteButton() {
    if (this.props.card.id && !this.props.test) {
      return (
        <Button
          small
          delete
          disabled={!!this.props.card.requesting}
          onClick={this.onClickDelete}
        >
          Delete
        </Button>
      );
    } else {
      return null;
    }
  }

  renderFlipButton() {
    if (!this.props.showBothSides) {
      return (
        <Tooltip
          message="Flip (Tab)"
          disabled={this.props.test && this.state.flipped}
        >
          <Button small onClick={this.onClickFlip}>
            Flip
          </Button>
        </Tooltip>
      );
    } else {
      return null;
    }
  }

  renderDeleteDialogBody() {
    return (
      <div>
        <p>Are you sure you want to delete this card?</p>
        <p>Question: {this.props.card.question || "No question"}</p>
        <p>Answer: {this.props.card.answer || "No answer"}</p>
      </div>
    );
  }

  renderDeleteDialogActions() {
    return (
      <Fragment>
        <Button delete onClick={this.onClickConfirmDelete}>
          Yes, delete this card
        </Button>,
        <Button onClick={this.onClickCancelDelete}>No, cancel</Button>
      </Fragment>
    );
  }

  renderSubmitButton() {
    if (!this.props.card.id && !this.props.test) {
      return (
        <Tooltip
          disabled={!this.canSubmit()}
          message={`Add (${metaKey}+Enter)`}
        >
          <Button
            small
            primary
            onClick={this.onClickAddCard}
            disabled={!this.canSubmit()}
          >
            Add
          </Button>
        </Tooltip>
      );
    } else {
      return null;
    }
  }

  renderUpdateButton() {
    if (this.props.card.id && !this.props.test) {
      return (
        <Tooltip
          disabled={!this.canUpdate()}
          message={`Update (${metaKey}+Enter)`}
        >
          <Button
            small
            primary
            disabled={!this.canUpdate()}
            onClick={this.onClickUpdateCard}
          >
            Update
          </Button>
        </Tooltip>
      );
    } else {
      return null;
    }
  }

  renderControls() {
    if (this.props.showControls) {
      return (
        <div className={styles.controls}>
          {this.renderFlipButton()}
          {this.renderSubmitButton()}
          {this.renderUpdateButton()}
          {this.renderDeleteButton()}
          {this.renderTestButtons()}
        </div>
      );
    } else {
      return null;
    }
  }

  render() {
    return (
      <Transition>
        <div
          key="flashCard"
          className={classNames(styles.flashCard, {
            [styles.dirty]: this.state.dirty,
            [styles.highlightUpdate]: this.state.highlightUpdate,
            [styles.deleting]: this.state.deleteDialogOpen,
            [styles.selected]: this.props.selected,
            [styles.test]: this.props.test,
            [styles.editable]: this.props.editable,
            [styles.selectable]: !this.props.editable && !this.props.test,
            [styles.flipped]: this.state.flipped && !this.props.showBothSides,
            [styles.showBothSides]: this.props.showBothSides
          })}
        >
          <div className={classNames(styles.front, styles.face)}>
            <div className={styles.faceTitle}>Question</div>
            <EditableContent
              ref={el => (this._question = el)}
              className={styles.question}
              value={this.state.question}
              editable={this.props.editable}
              onChange={this.onChangeQuestion}
              onKeyDown={this.onKeyDownQuestion}
            />
          </div>
          <div className={classNames(styles.back, styles.face)}>
            <div className={styles.faceTitle}>Answer</div>
            <EditableContent
              ref={el => (this._answer = el)}
              className={styles.answer}
              value={this.state.answer}
              editable={this.props.editable}
              onChange={this.onChangeAnswer}
              onKeyDown={this.onKeyDownAnswer}
            />
          </div>
          {this.renderControls()}
        </div>
      </Transition>
    );
  }
}

FlashCard.propTypes = {
  card: CARD_PROPTYPE,
  subjectId: PropTypes.string,
  editable: PropTypes.bool,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  onSelect: PropTypes.func,
  showBothSides: PropTypes.bool,
  test: PropTypes.bool,
  onAnswerTestCard: PropTypes.func,
  selected: PropTypes.bool,
  dispatch: PropTypes.func,
  showControls: PropTypes.bool,
  requesting: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  showDialog: PropTypes.func,
  hideDialog: PropTypes.func
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
  onAnswerTestCard: () => null,
  selected: false,
  showControls: true,
  requesting: false
};

export default FlashCard;

import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import { CARD_PROPTYPE } from "../../proptypes";
import { addCard, updateCard, removeCard } from "../../state/actions/cards";
import Button from "../button/button";
import EditableContent from "../editable-content/editable-content";
import Dialog from "../dialog/dialog";

import styles from "./flash-card.scss";

const faceEnum = {
  QUESTION: "QUESTION",
  ANSWER: "ANSWER"
};

class FlashCard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      question: props.card.question || "",
      answer: props.card.answer || "",
      flipped: false,
      deleteDialogOpen: false,
      highlightUpdate: false
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
    this.onCloseDeleteDialog = this.onCloseDeleteDialog.bind(this);
    this.onClickConfirmDelete = this.onClickConfirmDelete.bind(this);
    this.onClickCancelDelete = this.onClickCancelDelete.bind(this);
    this.onClickAddCard = this.onClickAddCard.bind(this);
    this.onClickUpdateCard = this.onClickUpdateCard.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.card.id === this.props.card.id &&
      prevProps.card.updated !== this.props.card.updated
    ) {
      this.highlightUpdate();
    }
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.card.question !== this.props.card.question) {
      this.setState({ question: nextProps.card.question });
    }
    if (nextProps.card.answer !== this.props.card.answer) {
      this.setState({ answer: nextProps.card.answer });
    }
  }

  onChangeQuestion(value) {
    this.setState({ question: value });
  }

  onChangeAnswer(value) {
    this.setState({ answer: value });
  }

  onClickDelete(e) {
    this.openDeleteDialog();
  }

  onClickCancelDelete() {
    this.closeDeleteDialog();
  }

  onClickConfirmDelete() {
    this.closeDeleteDialog();
    this.props.dispatch(removeCard(this.props.card.id));
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

  onCloseDeleteDialog() {
    this.setState({
      deleteDialogOpen: false
    });
  }

  onContinue(value) {
    this.flip();
    this.props.onContinue(this.props.card.id, value);
  }

  onKeyDownQuestion(e) {
    this.onKeyDown(e, faceEnum.QUESTION);
  }

  onKeyDownAnswer(e) {
    this.onKeyDown(e, faceEnum.ANSWER);
  }

  onKeyDown(e, face) {
    const modifierKey = e.metaKey || e.ctrlKey;
    if (this.props.test) {
      if (e.keyCode === 9) {
        // Tab
        if (face === faceEnum.ANSWER) {
          e.preventDefault();
          this.onContinue(false);
        } else {
          e.preventDefault();
          this.flip();
        }
      } else if (e.keyCode === 13) {
        // Enter
        if (face === faceEnum.ANSWER) {
          e.preventDefault();
          this.onContinue(true);
        }
      }
    } else if (this.props.editable) {
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

  closeDeleteDialog() {
    this.setState({
      deleteDialogOpen: false
    });
  }

  openDeleteDialog() {
    this.setState({
      deleteDialogOpen: true
    });
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
      this.props.dispatch(updateCard(this.props.card.id, this.value()));
    } else {
      // Create
      this.props.dispatch(addCard(this.value(), this.props.subjectId));
      this.resetCard();
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
      return [
        <Button small key={0} onClick={() => this.onContinue(true)} primary>
          Right
        </Button>,
        <Button small key={1} onClick={() => this.onContinue(false)}>
          Wrong
        </Button>
      ];
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
          disabled={this.props.card.requesting}
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
        <Button small onClick={this.onClickFlip}>
          Flip
        </Button>
      );
    } else {
      return null;
    }
  }

  renderDeleteDialog() {
    return (
      <Dialog
        open={this.state.deleteDialogOpen}
        onClose={this.onCloseDeleteDialog}
        header="Delete card?"
        body={
          <div>
            <p>Are you sure you want to delete this card?</p>
            <p>Question: {this.props.card.question || "No question"}</p>
            <p>Answer: {this.props.card.answer || "No answer"}</p>
          </div>
        }
        footer={[
          <Button key={0} delete onClick={this.onClickConfirmDelete}>
            Yes, delete this card
          </Button>,
          <Button key={1} onClick={this.onClickCancelDelete}>
            No, cancel
          </Button>
        ]}
      />
    );
  }

  renderSubmitButton() {
    if (!this.props.card.id && !this.props.test) {
      return (
        <Button small primary onClick={this.onClickAddCard}>
          Add
        </Button>
      );
    } else {
      return null;
    }
  }

  renderUpdateButton() {
    if (this.props.card.id && !this.props.test) {
      return (
        <Button
          small
          primary
          disabled={this.props.card.requesting}
          onClick={this.onClickUpdateCard}
        >
          Update
        </Button>
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
      <div
        className={classNames(styles.flashCard, {
          [styles.highlightUpdate]: this.state.highlightUpdate,
          [styles.deleting]: this.state.deleteDialogOpen,
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
        {this.renderDeleteDialog()}
      </div>
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
  onContinue: PropTypes.func,
  selected: PropTypes.bool,
  dispatch: PropTypes.func,
  showControls: PropTypes.bool
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
  selected: false,
  showControls: true
};

export default FlashCard;

import React, { PureComponent } from "react";
import classNames from "classnames";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import pluralize from "pluralize";

import { SUBJECT_PROPTYPE, CARDS_PROPTYPE } from "../../proptypes";
import Button from "../button/button";
import Dialog from "../dialog/dialog";

import { removeSubject } from "../../state/actions/subjects";
import { addTest } from "../../state/actions/tests";

import styles from "./subject-card.scss";

class SubjectCard extends PureComponent {
  static mapStateToProps(state) {
    return {
      cards: state.cards
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      deleteDialogOpen: false
    };
    this.onClickDelete = this.onClickDelete.bind(this);
    this.onClickTest = this.onClickTest.bind(this);
    this.onCloseDeleteDialog = this.onCloseDeleteDialog.bind(this);
    this.onClickConfirmDelete = this.onClickConfirmDelete.bind(this);
    this.onClickCancelDelete = this.onClickCancelDelete.bind(this);
    this.scatterFakeCards = this.scatterFakeCards.bind(this);
    this._fakeCards = [];
  }

  componentDidMount() {
    this.scatterFakeCards();
  }

  onClickDelete() {
    this.openDeleteDialog();
  }

  onClickCancelDelete() {
    this.closeDeleteDialog();
  }

  onClickConfirmDelete() {
    this.closeDeleteDialog();
    this.props.dispatch(removeSubject(this.props.subject.id));
  }

  onClickTest() {
    this.props.dispatch(addTest(this.props.subject.id));
  }

  onCloseDeleteDialog() {
    this.closeDeleteDialog();
  }

  /**
   * Randomly scatters the fake cards behind the subject card
   */
  scatterFakeCards() {
    if (this._fakeCards.length > 0) {
      setTimeout(() => {
        this._fakeCards.forEach(fakeCard => {
          if (fakeCard && fakeCard.style) {
            const rotateAmount = Math.round(Math.random() * 6 - 3);
            fakeCard.style.transform = `rotateZ(${rotateAmount}deg`;
          }
        });
      });
    }
  }

  openDeleteDialog() {
    this.setState({
      deleteDialogOpen: true
    });
  }

  closeDeleteDialog() {
    this.setState({
      deleteDialogOpen: false
    });
  }

  getCardCount() {
    return (
      Object.keys(this.props.cards.byId).filter(
        card => card.subjectId === this.props.subject.id
      ).length ||
      this.props.subject.cardCount ||
      0
    );
  }

  renderFakeCards() {
    return [
      <div
        className={styles.fakeCard}
        key="fakeCard-0"
        ref={el => this._fakeCards.push(el)}
      />,
      <div
        className={styles.fakeCard}
        key="fakeCard-1"
        ref={el => this._fakeCards.push(el)}
      />
    ];
  }

  renderDeleteDialog() {
    const cardCount = this.getCardCount();
    return (
      <Dialog
        open={this.state.deleteDialogOpen}
        onClose={this.onCloseDeleteDialog}
        header="Delete subject?"
        body={
          <div>
            <p>
              Are you sure you want to delete this subject and all of its cards?
            </p>
            <p>{`${this.props.subject.title ||
              "No title"} (${cardCount} ${pluralize("card", cardCount)})`}</p>
          </div>
        }
        footer={[
          <Button key={0} delete onClick={this.onClickConfirmDelete}>
            Yes, delete this subject and its {cardCount}{" "}
            {pluralize("card", cardCount)}
          </Button>,
          <Button key={1} onClick={this.onClickCancelDelete}>
            No, cancel
          </Button>
        ]}
      />
    );
  }

  render() {
    if (this.props.subject) {
      return (
        <div className={styles.subjectCardContainer}>
          {this.renderFakeCards()}
          <div
            className={classNames(styles.subjectCard, {
              [styles.deleting]: this.state.deleteDialogOpen
            })}
            onMouseOver={this.scatterFakeCards}
          >
            <div className={styles.title}>
              <NavLink to={`/subject/${this.props.subject.id}`}>
                {this.props.subject.title} ({this.getCardCount()})
              </NavLink>
            </div>
            <div className={styles.controls}>
              <Button small primary disabled onClick={this.onClickTest}>
                Test
              </Button>
              <Button
                small
                delete
                disabled={this.props.subject.requesting}
                onClick={this.onClickDelete}
              >
                Delete
              </Button>
            </div>
          </div>
          {this.renderDeleteDialog()}
        </div>
      );
    } else {
      return null;
    }
  }
}

SubjectCard.propTypes = {
  subject: SUBJECT_PROPTYPE,
  cards: CARDS_PROPTYPE,
  dispatch: PropTypes.func.isRequired
};

SubjectCard.defaultProps = {
  active: false,
  onChange: () => null
};

export default connect(SubjectCard.mapStateToProps)(SubjectCard);

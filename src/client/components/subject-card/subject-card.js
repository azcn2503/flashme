import React, { PureComponent, Fragment } from "react";
import classNames from "classnames";
import { connect } from "react-redux";
import { NavLink, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import pluralize from "pluralize";

import {
  SUBJECT_PROPTYPE,
  CARDS_PROPTYPE,
  TESTS_PROPTYPE
} from "client/proptypes";
import Button from "client/components/button/button";
import Card from "client/components/card/card";
import Tooltip from "client/components/tooltip/tooltip";
import { getSubjectFilteredCards } from "client/state/reducers/cards";
import { getSubjectFilteredTests } from "client/state/reducers/tests";
import { removeSubject } from "client/state/actions/subjects";
import { addTest } from "client/state/actions/tests";

import styles from "./subject-card.scss";

class SubjectCard extends PureComponent {
  static mapStateToProps(state) {
    return {
      cards: state.cards,
      tests: state.tests
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
    this.props
      .dispatch(addTest(this.props.subject.id))
      .then(test =>
        this.props.history.push(
          `/subject/${this.props.subject.id}/test/${test.id}`
        )
      );
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
    this.props.showDialog(
      "Delete subject?",
      this.renderDeleteDialogBody(),
      this.renderDeleteDialogActions(),
      {
        onClose: () => this.closeDeleteDialog()
      }
    );
  }

  closeDeleteDialog() {
    this.setState({
      deleteDialogOpen: false
    });
    this.props.hideDialog();
  }

  getCardCount() {
    return (
      getSubjectFilteredCards(this.props.cards, this.props.subject.id).length ||
      this.props.subject.cardCount ||
      0
    );
  }

  getTestCount() {
    return (
      getSubjectFilteredTests(this.props.tests, this.props.subject.id).length ||
      this.props.subject.testCount ||
      0
    );
  }

  renderFakeCards() {
    return (
      <Fragment>
        <div className={styles.fakeCard} ref={el => this._fakeCards.push(el)} />
        <div className={styles.fakeCard} ref={el => this._fakeCards.push(el)} />
      </Fragment>
    );
  }

  renderDeleteDialogBody() {
    const cardCount = this.getCardCount();
    const testCount = this.getTestCount();
    return (
      <div>
        <p>
          Are you sure you want to delete this subject and all of its cards and
          tests?
        </p>
        <p>{`${this.props.subject.title ||
          "No title"} (${cardCount} ${pluralize(
          "card",
          cardCount
        )} and ${testCount} ${pluralize("test", testCount)})`}</p>
      </div>
    );
  }

  renderDeleteDialogActions() {
    return (
      <Fragment>
        <Button delete onClick={this.onClickConfirmDelete}>
          Yes, delete this subject
        </Button>
        <Button onClick={this.onClickCancelDelete}>No, cancel</Button>
      </Fragment>
    );
  }

  render() {
    if (this.props.subject) {
      const cardCount = this.getCardCount();
      return (
        <div className={styles.subjectCardContainer}>
          <Card
            deleting={this.state.deleteDialogOpen}
            className={styles.subjectCard}
          >
            <div className={styles.title}>
              <div className={styles.label}>
                <NavLink to={`/subject/${this.props.subject.id}`}>
                  {this.props.subject.title}
                </NavLink>
              </div>
              <div className={styles.cardCount}>
                {cardCount} {pluralize("card", cardCount)}
              </div>
            </div>
            <div className={styles.controls}>
              <Tooltip
                disabled={this.getCardCount() !== 0}
                message="Add some cards to start a new test"
              >
                <Button
                  small
                  primary
                  disabled={
                    this.props.tests.requesting || this.getCardCount() === 0
                  }
                  onClick={this.onClickTest}
                >
                  Test
                </Button>
              </Tooltip>
              <Button
                small
                delete
                disabled={this.props.subject.requesting}
                onClick={this.onClickDelete}
              >
                Delete
              </Button>
            </div>
          </Card>
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
  tests: TESTS_PROPTYPE,
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func
  }),
  showDialog: PropTypes.func,
  hideDialog: PropTypes.func
};

SubjectCard.defaultProps = {
  active: false,
  onChange: () => null
};

export default withRouter(connect(SubjectCard.mapStateToProps)(SubjectCard));

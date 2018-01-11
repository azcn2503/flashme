import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import moment from "moment";
import pluralize from "pluralize";

import Tooltip from "client/components/tooltip/tooltip";
import Button from "client/components/button/button";
import Subheader from "client/components/subheader/subheader";
import TestStatus from "client/components/test-status/test-status";
import TestProgress from "client/components/test-progress/test-progress";
import Transition from "client/components/transition/transition";
import { getSubject } from "client/state/actions/subjects";
import { getCards } from "client/state/actions/cards";
import {
  getTestsForSubject,
  removeTest,
  addTest,
  addRetest,
  startTest
} from "client/state/actions/tests";
import { testStatusEnum, testTypeEnum } from "shared/tests";
import {
  SUBJECTS_PROPTYPE,
  CARDS_PROPTYPE,
  TESTS_PROPTYPE
} from "client/proptypes";

import styles from "./subject-tests.scss";

class SubjectTests extends PureComponent {
  static mapStateToProps(state) {
    const { cards, subjects, tests } = state;
    return { cards, subjects, tests };
  }

  constructor(props) {
    super(props);
    this.state = {
      deleteDialogOpen: false,
      deleteTest: null
    };
    this._progressBars = {};
    this.onClickDeleteTest = this.onClickDeleteTest.bind(this);
    this.onClickAddTest = this.onClickAddTest.bind(this);
    this.onClickConfirmDeleteTest = this.onClickConfirmDeleteTest.bind(this);
    this.onClickCancelDeleteTest = this.onClickCancelDeleteTest.bind(this);
    this.onCloseDeleteDialog = this.onCloseDeleteDialog.bind(this);
    this.onClickCardsButton = this.onClickCardsButton.bind(this);
  }

  componentDidMount() {
    if (!this.props.subjects.byId[this.props.subjectId]) {
      this.props.dispatch(getSubject(this.props.subjectId));
    }
    if (!this.subjectHasCards()) {
      this.props.dispatch(getCards(this.props.subjectId));
    }
    if (!this.props.tests.requesting) {
      this.props.dispatch(getTestsForSubject(this.props.subjectId));
    }
  }

  componentWillUpdate() {
    this._progressBars = {};
  }

  onClickDeleteTest(testId) {
    this.props.showDialog(
      "Delete test?",
      this.renderDeleteDialogBody(testId),
      this.renderDeleteDialogActions(testId)
    );
  }

  onClickConfirmDeleteTest(testId) {
    this.props.dispatch(removeTest(testId));
    this.props.hideDialog();
  }

  onClickCancelDeleteTest() {
    this.props.hideDialog();
  }

  onCloseDeleteDialog() {
    this.props.hideDialog();
  }

  onClickAddTest() {
    this.props.dispatch(addTest(this.props.subjectId));
  }

  onClickRetest(testId) {
    this.props.dispatch(addRetest(this.props.subjectId, testId));
  }

  onClickStartTest(testId) {
    this.props.dispatch(startTest(testId));
    this.props.history.push(`/subject/${this.props.subjectId}/test/${testId}`);
  }

  onClickContinueTest(testId) {
    this.props.history.push(`/subject/${this.props.subjectId}/test/${testId}`);
  }

  onClickReviewTest(testId) {
    this.props.history.push(`/subject/${this.props.subjectId}/test/${testId}`);
  }

  onClickCardsButton() {
    this.props.history.push(`/subject/${this.props.subjectId}`);
  }

  subjectHasCards() {
    return Object.values(this.props.cards.byId).find(
      card => card.subjectId === this.props.subjectId
    );
  }

  getSubjectFilteredCards() {
    return Object.values(this.props.cards.byId).filter(
      card => card.subjectId === this.props.subjectId
    );
  }

  getSubjectFilteredTests() {
    return Object.values(this.props.tests.byId).filter(
      test => test.subjectId === this.props.subjectId
    );
  }

  renderTestType(test) {
    if (test.type === testTypeEnum.SUBJECT_TEST) {
      return "Test";
    } else if (test.type === testTypeEnum.SUBJECT_RETEST) {
      return "Retest";
    } else {
      return "Test";
    }
  }

  renderTestProgress(test) {
    return (
      <div className={styles.testProgress}>
        <div
          className={styles.progressBar}
          ref={el => (this._progressBars[test.id] = el)}
          style={{ width: "0%" }}
        >
          <div className={styles.progressLabel}>
            {this.getTestProgressPercent(test)}%
          </div>
        </div>
      </div>
    );
  }

  renderTestAction(test) {
    const actions = [];
    if (test.status === testStatusEnum.NOT_STARTED) {
      actions.push(
        <Button
          key="startButton"
          small
          primary
          onClick={() => this.onClickStartTest(test.id)}
        >
          Start
        </Button>
      );
    } else if (test.status === testStatusEnum.STARTED) {
      actions.push(
        <Button
          key="continueButton"
          small
          primary
          onClick={() => this.onClickContinueTest(test.id)}
        >
          Continue
        </Button>
      );
    } else if (
      test.status === testStatusEnum.COMPLETED ||
      test.status === testStatusEnum.ABANDONED
    ) {
      actions.push(
        <Button
          key="reviewButton"
          small
          primary
          onClick={() => this.onClickReviewTest(test.id)}
        >
          Review
        </Button>
      );
      if (test.cards.find(card => card.correct === false)) {
        actions.push(
          <Tooltip
            key="retest"
            message="Retest the cards you failed on this test"
          >
            <Button small primary onClick={() => this.onClickRetest(test.id)}>
              Retest
            </Button>
          </Tooltip>
        );
      }
    } else {
      return null;
    }
    return actions;
  }

  renderTestList(tests = []) {
    return (
      <div className={styles.testList}>
        <table className={styles.testTable}>
          <thead>
            <tr>
              <th>Type</th>
              <th>Status</th>
              <th>Progress</th>
              <th>Cards</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <Transition component="tbody">
            {tests.map(test => (
              <tr key={test.id}>
                <td>{this.renderTestType(test)}</td>
                <td>
                  <TestStatus test={test} />
                </td>
                <td>
                  <TestProgress test={test} />
                </td>
                <td>{test.cards.length}</td>
                <td>{moment(test.created).fromNow()}</td>
                <td>
                  <div className={styles.testActions}>
                    {this.renderTestAction(test)}
                    <Button
                      small
                      delete
                      onClick={() => this.onClickDeleteTest(test.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </Transition>
        </table>
      </div>
    );
  }

  renderActions() {
    return (
      <div className={styles.actions}>
        <Tooltip
          message={
            this.subjectHasCards()
              ? "Add a new test for this subject"
              : "Add some cards to create a new test"
          }
        >
          <Button
            primary
            disabled={this.props.tests.requesting || !this.subjectHasCards()}
            onClick={this.onClickAddTest}
          >
            New Test
          </Button>
        </Tooltip>
      </div>
    );
  }

  renderDeleteDialogBody(testId) {
    const test = this.props.tests.byId[testId];
    return (
      <div>
        <p>Are you sure you want to delete test {test.id}?</p>
        <p>
          This test was created {moment(test.created).fromNow()} and contains{" "}
          {test.cards.length} {pluralize("card", test.cards.length)}.
        </p>
      </div>
    );
  }

  renderDeleteDialogActions(testId) {
    return [
      <Button
        key={0}
        delete
        onClick={() => this.onClickConfirmDeleteTest(testId)}
      >
        Yes, delete this test
      </Button>,
      <Button key={1} onClick={this.onClickCancelDeleteTest}>
        No, cancel
      </Button>
    ];
  }

  render() {
    if (this.props.subjects.byId[this.props.subjectId]) {
      const subject = this.props.subjects.byId[this.props.subjectId];
      const tests = this.getSubjectFilteredTests();
      return (
        <div className={styles.subjectTests}>
          <div className={styles.subheader}>
            <Subheader label={`Tests for ${subject.title}`} />
            {this.renderActions()}
          </div>
          {this.renderTestList(tests)}
        </div>
      );
    } else {
      return null;
    }
  }
}

SubjectTests.propTypes = {
  dispatch: PropTypes.func,
  subjectId: PropTypes.string,
  subjects: SUBJECTS_PROPTYPE,
  cards: CARDS_PROPTYPE,
  tests: TESTS_PROPTYPE,
  history: PropTypes.shape({
    push: PropTypes.func
  }),
  showDialog: PropTypes.func,
  hideDialog: PropTypes.func
};

export default withRouter(connect(SubjectTests.mapStateToProps)(SubjectTests));

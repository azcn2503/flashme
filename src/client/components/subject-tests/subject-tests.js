import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import moment from "moment";
import pluralize from "pluralize";

import Button from "client/components/button/button";
import Dialog from "client/components/dialog/dialog";
import Subheader from "client/components/subheader/subheader";
import TestStatus from "client/components/test-status/test-status";
import { getSubject } from "client/state/actions/subjects";
import {
  getTestsForSubject,
  removeTest,
  addTest,
  startTest
} from "client/state/actions/tests";
import { testStatusEnum } from "shared/tests";
import { SUBJECTS_PROPTYPE, TESTS_PROPTYPE } from "client/proptypes";

import styles from "./subject-tests.scss";

class SubjectTests extends PureComponent {
  static mapStateToProps(state) {
    return {
      subjects: state.subjects,
      tests: state.tests
    };
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
  }

  componentDidMount() {
    if (!this.props.subjects.byId[this.props.subjectId]) {
      this.props.dispatch(getSubject(this.props.subjectId));
    }
    if (!this.props.tests.requesting) {
      this.props.dispatch(getTestsForSubject(this.props.subjectId));
    }
    this.updateTestProgressBars();
  }

  componentWillUpdate() {
    this._progressBars = {};
  }

  componentDidUpdate() {
    this.updateTestProgressBars();
  }

  updateTestProgressBars() {
    requestAnimationFrame(() => {
      this.getSubjectFilteredTests().forEach(test => {
        if (this._progressBars[test.id]) {
          this._progressBars[
            test.id
          ].style.width = `${this.getTestProgressPercent(test)}%`;
        }
      });
    });
  }

  onClickDeleteTest(testId) {
    this.setState({
      deleteTest: this.props.tests.byId[testId],
      deleteDialogOpen: true
    });
  }

  onClickConfirmDeleteTest() {
    this.props.dispatch(removeTest(this.state.deleteTest.id));
    this.setState({
      deleteDialogOpen: false
    });
  }

  onClickCancelDeleteTest() {
    this.setState({
      deleteDialogOpen: false
    });
  }

  onCloseDeleteDialog() {
    this.setState({
      deleteDialogOpen: false
    });
  }

  onClickAddTest() {
    this.props.dispatch(addTest(this.props.subjectId));
  }

  onClickStartTest(testId) {
    this.props.dispatch(startTest(testId));
    this.props.history.push(`/subject/${this.props.subjectId}/test/${testId}`);
  }

  getTestProgressPercent(test) {
    return Math.round(100 / (test.cards.length || 1) * (test.activeCard || 0));
  }

  getSubjectFilteredTests() {
    return Object.values(this.props.tests.byId).filter(
      test => test.subjectId === this.props.subjectId
    );
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

  renderTestList(tests = []) {
    return (
      <div className={styles.testList}>
        <table className={styles.testTable}>
          <thead>
            <tr>
              <th>#</th>
              <th>ID</th>
              <th>Status</th>
              <th>Progress</th>
              <th>Cards</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tests.map((test, key) => (
              <tr key={test.id}>
                <td>{key + 1}</td>
                <td>
                  <Link to={`/subject/${this.props.subjectId}/test/${test.id}`}>
                    {test.id}
                  </Link>
                </td>
                <td>
                  <TestStatus test={test} />
                </td>
                <td>{this.renderTestProgress(test)}</td>
                <td>{test.cards.length}</td>
                <td>{moment(test.created).fromNow()}</td>
                <td>
                  <div className={styles.testActions}>
                    <Button
                      primary
                      onClick={() => this.onClickStartTest(test.id)}
                      disabled={
                        test.status === testStatusEnum.COMPLETED ||
                        test.status === testStatusEnum.ABANDONED
                      }
                    >
                      {test.status === testStatusEnum.STARTED
                        ? "Continue"
                        : "Start"}
                    </Button>
                    <Button
                      delete
                      onClick={() => this.onClickDeleteTest(test.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  renderActions() {
    return (
      <div className={styles.actions}>
        <Button
          primary
          disabled={this.props.tests.requesting}
          onClick={this.onClickAddTest}
        >
          New Test
        </Button>
      </div>
    );
  }

  renderDeleteDialog() {
    const { deleteTest } = this.state;
    return (
      <Dialog
        open={this.state.deleteDialogOpen}
        onClose={this.onCloseDeleteDialog}
        header="Delete test?"
        body={
          deleteTest ? (
            <div>
              <p>Are you sure you want to delete test {deleteTest.id}?</p>
              <p>
                This test was created {moment(deleteTest.created).fromNow()} and
                contains {deleteTest.cards.length}{" "}
                {pluralize("card", deleteTest.cards.length)}.
              </p>
            </div>
          ) : null
        }
        footer={[
          <Button key={0} delete onClick={this.onClickConfirmDeleteTest}>
            Yes, delete this test
          </Button>,
          <Button key={1} onClick={this.onClickCancelDeleteTest}>
            No, cancel
          </Button>
        ]}
      />
    );
  }

  render() {
    if (this.props.subjects.byId[this.props.subjectId]) {
      const subject = this.props.subjects.byId[this.props.subjectId];
      const tests = this.getSubjectFilteredTests();
      return (
        <div className={styles.subjectTests}>
          <Subheader label={`${subject.title}: Tests (${tests.length})`} />
          {this.renderActions()}
          {this.renderTestList(tests)}
          {this.renderDeleteDialog()}
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
  tests: TESTS_PROPTYPE,
  history: PropTypes.shape({
    push: PropTypes.func
  })
};

export default withRouter(connect(SubjectTests.mapStateToProps)(SubjectTests));

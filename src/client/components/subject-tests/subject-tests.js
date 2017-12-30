import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import moment from "moment";
import pluralize from "pluralize";

import Button from "client/components/button/button";
import Subheader from "client/components/subheader/subheader";
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
    this._progressBars = {};
    this.onClickRemoveTest = this.onClickRemoveTest.bind(this);
    this.onClickAddTest = this.onClickAddTest.bind(this);
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

  onClickRemoveTest(testId) {
    this.props.dispatch(removeTest(testId));
  }

  onClickAddTest() {
    this.props.dispatch(addTest(this.props.subjectId));
  }

  onClickStartTest(testId) {
    this.props.dispatch(startTest(testId));
    this.props.history.push(`/subject/${this.props.subjectId}/test/${testId}`);
  }

  testStatusText(status = testStatusEnum.NOT_STARTED) {
    switch (status) {
      case testStatusEnum.NOT_STARTED:
        return "Not started";
      case testStatusEnum.STARTED:
        return "Started";
      case testStatusEnum.COMPLETED:
        return "Completed";
      case testStatusEnum.ABANDONED:
        return "Abandoned";
      default:
        return status;
    }
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
                  <div
                    className={classNames(styles.testStatus, {
                      [styles.notStarted]:
                        test.status === testStatusEnum.NOT_STARTED,
                      [styles.started]: test.status === testStatusEnum.STARTED,
                      [styles.completed]:
                        test.status === testStatusEnum.COMPLETED,
                      [styles.abandoned]:
                        test.status === testStatusEnum.ABANDONED,
                      [styles.unknown]: !test.status
                    })}
                  >
                    {this.testStatusText(test.status)}
                  </div>
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
                      onClick={() => this.onClickRemoveTest(test.id)}
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

  render() {
    if (this.props.subjects.byId[this.props.subjectId]) {
      const subject = this.props.subjects.byId[this.props.subjectId];
      const tests = this.getSubjectFilteredTests();
      return (
        <div className={styles.subjectTests}>
          <Subheader label={`${subject.title}: Tests (${tests.length})`} />
          {this.renderActions()}
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
  tests: TESTS_PROPTYPE,
  history: PropTypes.shape({
    push: PropTypes.func
  })
};

export default withRouter(connect(SubjectTests.mapStateToProps)(SubjectTests));

import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import moment from "moment";
import pluralize from "pluralize";

import Subheader from "client/components/subheader/subheader";
import { getSubject } from "client/state/actions/subjects";
import { getTestsForSubject } from "client/state/actions/tests";
import { SUBJECTS_PROPTYPE, TESTS_PROPTYPE } from "client/proptypes";

import styles from "./subject-tests.scss";

class SubjectTests extends PureComponent {
  static mapStateToProps(state) {
    return {
      subjects: state.subjects,
      tests: state.tests
    };
  }

  componentDidMount() {
    if (!this.props.subjects.byId[this.props.subjectId]) {
      this.props.dispatch(getSubject(this.props.subjectId));
    }
    if (this.props.tests.allIds.length === 0) {
      this.props.dispatch(getTestsForSubject(this.props.subjectId));
    }
  }

  renderTestsList(tests = []) {
    return (
      <div className={styles.testsList}>
        {tests.map((test, key) => (
          <div key={key} className={styles.test}>
            {test.id} with {test.cards.length}{" "}
            {pluralize("card", test.cards.length)} created{" "}
            {moment(test.created).fromNow()}
          </div>
        ))}
      </div>
    );
  }

  render() {
    if (
      this.props.subjects.allIds.length > 0 &&
      this.props.tests.allIds.length > 0
    ) {
      const subject = this.props.subjects.byId[this.props.subjectId];
      const tests = Object.values(this.props.tests.byId).filter(
        test => test.subjectId === subject.id
      );
      return (
        <div className={styles.subjectTests}>
          <Subheader label={`${subject.title}: Tests (${tests.length})`} />
          {this.renderTestsList(tests)}
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
  tests: TESTS_PROPTYPE
};

export default connect(SubjectTests.mapStateToProps)(SubjectTests);

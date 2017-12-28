import React, { PureComponent } from "react";
import { connect } from "react-redux";
import moment from "moment";
import pluralize from "pluralize";

import styles from "./subject-tests.scss";
import Subheader from "../subheader/subheader";

class SubjectTests extends PureComponent {
  static mapStateToProps(state) {
    return {
      subjects: state.subjects,
      tests: state.tests
    };
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

export default connect(SubjectTests.mapStateToProps)(SubjectTests);

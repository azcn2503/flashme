import React, { PureComponent } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import pluralize from "pluralize";

import { getTest } from "client/state/actions/tests";
import { getSubject } from "client/state/actions/subjects";
import Subheader from "../subheader/subheader";

import styles from "./test.scss";

class Test extends PureComponent {
  static mapStateToProps(state) {
    return {
      subjects: state.subjects,
      tests: state.tests
    };
  }

  componentDidMount() {
    this.props.dispatch(getSubject(this.props.subjectId));
    this.props.dispatch(getTest(this.props.testId));
  }

  render() {
    if (
      this.props.tests.allIds.length > 0 &&
      this.props.subjects.allIds.length > 0
    ) {
      const test = this.props.tests.byId[this.props.testId];
      const subject = this.props.subjects.byId[this.props.subjectId];
      return (
        <div className={styles.test}>
          <Subheader
            label={`Test: ${subject.title} (${test.cards.length} ${pluralize(
              "card",
              test.cards.length
            )})`}
          />
        </div>
      );
    } else {
      return null;
    }
  }
}

Test.propTypes = {
  dispatch: PropTypes.func,
  testId: PropTypes.string,
  subjectId: PropTypes.string,
  tests: PropTypes.object,
  subjects: PropTypes.object
};

export default connect(Test.mapStateToProps)(Test);

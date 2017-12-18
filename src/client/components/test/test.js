import React, { PureComponent } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Subheader from "../subheader/subheader";

import styles from "./test.scss";

class Test extends PureComponent {
  static mapStateToProps(state) {
    return {
      subjects: state.subjects,
      tests: state.tests
    };
  }

  render() {
    const test = this.props.tests.byId[this.props.testId];
    const subject = this.props.subjects.byId[test.subjectId];
    return (
      <div className={styles.test}>
        <Subheader
          label={`Test: ${subject.title} (${test.cards.length} cards)`}
        />
      </div>
    );
  }
}

Test.propTypes = {
  testId: PropTypes.string,
  tests: PropTypes.object,
  subjects: PropTypes.object
};

export default connect(Test.mapStateToProps)(Test);

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
    if (
      this.props.tests.allIds.length > 0 &&
      this.props.subjects.allIds.length > 0
    ) {
      const test = this.props.tests.byId[this.props.testId];
      const subject = this.props.subjects.byId[test.id];
      return (
        <div className={styles.test}>
          <Subheader
            label={`Test: ${subject.title} (${test.cards.length} cards)`}
          />
        </div>
      );
    } else {
      return null;
    }
  }
}

Test.propTypes = {
  testId: PropTypes.string,
  tests: PropTypes.object,
  subjects: PropTypes.object
};

export default connect(Test.mapStateToProps)(Test);

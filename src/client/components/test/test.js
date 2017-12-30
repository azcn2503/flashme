import React, { PureComponent } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import pluralize from "pluralize";

import { getTest } from "client/state/actions/tests";
import { getSubject } from "client/state/actions/subjects";
import Subheader from "client/components/subheader/subheader";
import FlashCard from "client/components/flash-card/flash-card";

import styles from "./test.scss";

class Test extends PureComponent {
  static mapStateToProps(state) {
    return {
      subjects: state.subjects,
      tests: state.tests
    };
  }

  componentDidMount() {
    if (!this.props.tests.byId[this.props.testId]) {
      this.props.dispatch(getTest(this.props.testId));
    }
    if (!this.props.subjects.byId[this.props.subjectId]) {
      this.props.dispatch(getSubject(this.props.subjectId));
    }
  }

  renderTestCard() {
    const test = this.props.tests.byId[this.props.testId];
    return <FlashCard card={test.cards[test.activeCard]} test />;
  }

  render() {
    if (
      this.props.tests.byId[this.props.testId] &&
      this.props.subjects.byId[this.props.subjectId]
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
          <div className={styles.cardContainer}>{this.renderTestCard()}</div>
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

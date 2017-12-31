import React, { PureComponent } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import pluralize from "pluralize";

import { testStatusEnum } from "shared/tests";
import {
  getTest,
  startTest,
  completeTest,
  abandonTest,
  answerTestCard
} from "client/state/actions/tests";
import { getSubject } from "client/state/actions/subjects";
import Subheader from "client/components/subheader/subheader";
import FlashCard from "client/components/flash-card/flash-card";
import Button from "client/components/button/button";
import TestStatus from "client/components/test-status/test-status";
import TestProgress from "client/components/test-progress/test-progress";

import styles from "./test.scss";

class Test extends PureComponent {
  static mapStateToProps(state) {
    return {
      subjects: state.subjects,
      tests: state.tests
    };
  }

  constructor(props) {
    super(props);
    this.onClickStartTest = this.onClickStartTest.bind(this);
    this.onClickAbandonTest = this.onClickAbandonTest.bind(this);
    this.onAnswerTestCard = this.onAnswerTestCard.bind(this);
  }

  componentDidMount() {
    if (!this.props.tests.byId[this.props.testId]) {
      this.props.dispatch(getTest(this.props.testId));
    } else {
      this.checkTestCompleted();
    }
    if (!this.props.subjects.byId[this.props.subjectId]) {
      this.props.dispatch(getSubject(this.props.subjectId));
    }
  }

  componentDidUpdate(prevProps) {
    const prevTest = prevProps.tests.byId[prevProps.testId];
    const test = this.props.tests.byId[this.props.testId];
    if (prevTest && test && prevTest.activeCard !== test.activeCard) {
      this.checkTestCompleted();
    }
  }

  onClickStartTest() {
    this.props.dispatch(startTest(this.props.testId));
  }

  onClickAbandonTest() {
    this.props.dispatch(abandonTest(this.props.testId));
  }

  onAnswerTestCard(value) {
    const test = this.props.tests.byId[this.props.testId];
    this.props.dispatch(
      answerTestCard(this.props.testId, test.activeCard, value)
    );
  }

  checkTestCompleted() {
    const test = this.props.tests.byId[this.props.testId];
    if (test && test.activeCard >= test.cards.length) {
      this.props.dispatch(completeTest(this.props.testId));
    }
  }

  renderTestCard() {
    const test = this.props.tests.byId[this.props.testId];
    if (test.status === testStatusEnum.STARTED && test.cards[test.activeCard]) {
      return (
        <FlashCard
          card={test.cards[test.activeCard]}
          onAnswerTestCard={this.onAnswerTestCard}
          test
        />
      );
    } else {
      return null;
    }
  }

  renderActions() {
    const test = this.props.tests.byId[this.props.testId];
    if (test.status === testStatusEnum.NOT_STARTED) {
      return (
        <Button primary onClick={this.onClickStartTest}>
          Start Test
        </Button>
      );
    } else if (test.status === testStatusEnum.STARTED) {
      return (
        <Button primary onClick={this.onClickAbandonTest}>
          Abandon Test
        </Button>
      );
    } else {
      return null;
    }
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
          <div className={styles.subheader}>
            <Subheader
              label={`Test: ${subject.title} (${test.cards.length} ${pluralize(
                "card",
                test.cards.length
              )})`}
            />
            <TestStatus test={test} />
            <div className={styles.actions}>{this.renderActions()}</div>
          </div>
          <div className={styles.testProgressContainer}>
            <TestProgress test={test} />
          </div>
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

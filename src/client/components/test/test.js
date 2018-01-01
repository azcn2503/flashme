import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import classNames from "classnames";
import PropTypes from "prop-types";
import pluralize from "pluralize";

import { testStatusEnum, testTypeEnum } from "shared/tests";
import {
  getTest,
  startTest,
  completeTest,
  abandonTest,
  answerTestCard,
  addRetest
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
    this.onClickRetest = this.onClickRetest.bind(this);
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

  onClickRetest() {
    this.props
      .dispatch(addRetest(this.props.subjectId, this.props.testId))
      .then(test => {
        console.log(test);
        this.props.history.push(
          `/subject/${this.props.subjectId}/test/${test.id}`
        );
      });
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

  getQuestionMarkup(card) {
    return {
      __html: card.question
    };
  }

  getAnswerMarkup(card) {
    return {
      __html: card.answer
    };
  }

  testTypeLabel(test) {
    if (test.type === testTypeEnum.SUBJECT_TEST) {
      return "Test";
    } else if (test.type === testTypeEnum.SUBJECT_RETEST) {
      return "Retest";
    } else {
      return "Test";
    }
  }

  renderTestSummary() {
    const test = this.props.tests.byId[this.props.testId];
    if (
      test.status === testStatusEnum.COMPLETED ||
      test.status === testStatusEnum.ABANDONED
    ) {
      return (
        <div className={styles.testSummary}>
          <table className={styles.summaryTable}>
            <thead>
              <tr>
                <th>Question</th>
                <th>Answer</th>
                <th>Correct</th>
              </tr>
            </thead>
            <tbody>
              {test.cards.map(card => (
                <tr key={card.id}>
                  <td dangerouslySetInnerHTML={this.getQuestionMarkup(card)} />
                  <td dangerouslySetInnerHTML={this.getAnswerMarkup(card)} />
                  <td>
                    <div
                      className={classNames({
                        [styles.correct]: card.correct,
                        [styles.incorrect]:
                          card.hasOwnProperty("correct") && !card.correct,
                        [styles.notAnswered]: !card.hasOwnProperty("correct")
                      })}
                    >
                      {card.hasOwnProperty("correct")
                        ? card.correct ? "Yes" : "No"
                        : "Not answered"}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  }

  renderTestPreparation() {
    const test = this.props.tests.byId[this.props.testId];
    if (test.status === testStatusEnum.NOT_STARTED) {
      return (
        <div className={styles.testPreparation}>
          Get ready to start the test!
        </div>
      );
    } else {
      return null;
    }
  }

  renderTestCard() {
    const test = this.props.tests.byId[this.props.testId];
    if (test.status === testStatusEnum.STARTED && test.cards[test.activeCard]) {
      return (
        <div className={styles.testCard}>
          <FlashCard
            card={test.cards[test.activeCard]}
            onAnswerTestCard={this.onAnswerTestCard}
            requesting={this.props.tests.requesting}
            test
          />
        </div>
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
        <Button delete onClick={this.onClickAbandonTest}>
          Abandon Test
        </Button>
      );
    } else if (
      test.cards.find(card => card.correct === false) &&
      (test.status === testStatusEnum.COMPLETED ||
        test.status === testStatusEnum.ABANDONED)
    ) {
      return (
        <Button primary onClick={this.onClickRetest}>
          Retest
        </Button>
      );
    } else {
      return null;
    }
  }

  renderCardNumbers() {
    const test = this.props.tests.byId[this.props.testId];
    if (test.status === testStatusEnum.STARTED) {
      return (
        <div className={styles.cardNumbers}>
          Card {test.activeCard + 1} / {test.cards.length}
        </div>
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
              label={`${this.testTypeLabel(test)}: ${subject.title} (${
                test.cards.length
              } ${pluralize("card", test.cards.length)})`}
            />
            <TestStatus test={test} />
            {this.renderCardNumbers()}
            <div className={styles.actions}>{this.renderActions()}</div>
          </div>
          <div className={styles.testProgressContainer}>
            <TestProgress test={test} />
          </div>
          {this.renderTestCard()}
          {this.renderTestPreparation()}
          {this.renderTestSummary()}
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
  subjects: PropTypes.object,
  history: PropTypes.shape({
    push: PropTypes.func
  })
};

export default withRouter(connect(Test.mapStateToProps)(Test));

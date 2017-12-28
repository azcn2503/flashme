import React, { PureComponent } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { debounce } from "lodash";
import pluralize from "pluralize";

import {
  CARDS_PROPTYPE,
  SUBJECTS_PROPTYPE,
  TESTS_PROPTYPE
} from "client/proptypes";
import { getSubject, updateSubjectTitle } from "client/state/actions/subjects";
import { getCards, addCard, answerTestCard } from "client/state/actions/cards";
import { getTestsForSubject } from "client/state/actions/tests";
import { startTest } from "client/state/actions/tests";
import FlashCard from "client/components/flash-card/flash-card";
import FilterBox from "client/components/filter-box/filter-box";
import Button from "client/components/button/button";
import Subheader from "client/components/subheader/subheader";

import styles from "./cards.scss";

class Cards extends PureComponent {
  static mapStateToProps(state) {
    return {
      cards: state.cards,
      subjects: state.subjects,
      tests: state.tests
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      cards: [],
      filter: "",
      showBothSides: false
    };
    this.onClickShowBothSides = this.onClickShowBothSides.bind(this);
    this.onChangeFilter = this.onChangeFilter.bind(this);
    this.filterCardsBySearchTerm = this.filterCardsBySearchTerm.bind(this);
    this.filterCardsBySubject = this.filterCardsBySubject.bind(this);
    this.renderCard = this.renderCard.bind(this);
    this.onChangeSubjectTitle = debounce(
      this.onChangeSubjectTitle.bind(this),
      500
    );
  }

  componentDidMount() {
    this.getCards();
    this.getSubject();
    this.getTestsForSubject();
    if (this.props.test) {
      this.props.dispatch(startTest(this.props.subjectId, this.props.testId));
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.subjectId !== this.props.subjectId) {
      this.getCards();
      this.setState({
        cards: Object.values(this.props.cards.byId).filter(
          this.filterCardsBySubject
        )
      });
    }
  }

  getTestsForSubject() {
    this.props.dispatch(getTestsForSubject(this.props.subjectId));
  }

  getSubject() {
    this.props.dispatch(getSubject(this.props.subjectId));
  }

  getCards() {
    this.props.dispatch(getCards(this.props.subjectId));
  }

  addCard(card) {
    this.props.dispatch(addCard(card, this.props.subjectId));
  }

  onClickShowBothSides() {
    this.setState({
      showBothSides: !this.state.showBothSides
    });
  }

  onChangeFilter(e) {
    this.setState({
      filter: e.target.value
    });
  }

  onChangeSubjectTitle(value) {
    this.props.dispatch(updateSubjectTitle(this.props.subjectId, value));
  }

  onSubmitCard(value) {
    this.addCard(value);
  }

  onAnswerTestCard(cardId, correct) {
    this.props.dispatch(
      answerTestCard(this.props.subjectId, this.props.testId, cardId, correct)
    );
  }

  renderTestContainer() {
    if (this.state.cards.length === 0) {
      return <div className={styles.testContainer}>Nothing to test!</div>;
    } else if (this.props.test.activeCardIndex < this.state.cards.length) {
      return (
        <div className={styles.testContainer}>
          <div className={styles.progressContainer}>
            <div
              className={styles.progressBar}
              style={{
                width: `${Math.floor(
                  100 /
                    this.state.cards.length *
                    (this.props.test.activeCardIndex + 1)
                )}%`
              }}
            />
            <div className={styles.progressSummary}>
              {this.state.testCard > 0 ? (
                <div>
                  {this.state.correct} of {this.state.testCard} ({Math.floor(
                    100 / this.state.testCard * this.state.correct
                  )}%)
                </div>
              ) : null}
            </div>
          </div>
          <div className={styles.testStatus}>
            Card {this.props.test.activeCardIndex + 1} of{" "}
            {this.state.cards.length}
          </div>
          <div className={styles.testCard}>
            <FlashCard
              dispatch={this.props.dispatch}
              card={this.state.cards[this.props.test.activeCardIndex]}
              test
            />
          </div>
        </div>
      );
    } else {
      const correctCount = this.props.test.cards.filter(card => card.correct)
        .length;
      const totalCount = this.props.test.cards.length;
      return (
        <div className={styles.testContainer}>
          Test completed - you scored {correctCount} of {totalCount} ({Math.floor(
            100 / totalCount * correctCount
          )}%)
          {this.renderPostTestActions()}
        </div>
      );
    }
  }

  renderPostTestActions() {
    return (
      <div className={styles.postTestActions}>
        <Button primary>Why am I so bad?</Button>
        <Button>Why am I so amazing?</Button>
      </div>
    );
  }

  filterCardsBySubject(card) {
    return card.subjectId === this.props.subjectId;
  }

  filterCardsBySearchTerm(card) {
    const filter = this.state.filter.toLowerCase();
    return (
      card.question.toLowerCase().includes(filter) ||
      card.answer.toLowerCase().includes(filter)
    );
  }

  renderCard(card, key) {
    return (
      <FlashCard
        dispatch={this.props.dispatch}
        key={key}
        card={card}
        subjectId={this.props.subjectId}
        showBothSides={this.state.showBothSides}
        selected={card.selected}
        editable
      />
    );
  }

  renderCardList() {
    const cards = Object.values(this.props.cards.byId)
      .filter(this.filterCardsBySubject)
      .filter(this.filterCardsBySearchTerm);
    return (
      <div className={styles.cardList}>
        <FlashCard
          dispatch={this.props.dispatch}
          card={{}}
          subjectId={this.props.subjectId}
          editable
          showBothSides={this.state.showBothSides}
        />
        {this.props.cards ? cards.map(this.renderCard) : null}
      </div>
    );
  }

  renderFilters() {
    if (!this.props.test) {
      const subjectCards = Object.values(this.props.cards.byId).filter(
        this.filterCardsBySubject
      );
      return (
        <FilterBox
          onChange={this.onChangeFilter}
          value={this.state.filter}
          type="cards"
          totalCount={subjectCards.filter(this.filterCardsBySubject).length}
          filteredCount={
            subjectCards.filter(this.filterCardsBySearchTerm).length
          }
        />
      );
    } else {
      return null;
    }
  }

  renderControls() {
    const selected = Object.values(this.props.cards.byId).filter(
      card => card.selected
    );
    return (
      <div className={styles.controls}>
        {this.renderFilters()}
        {!this.props.test ? (
          <Button onClick={this.onClickShowBothSides} primary>
            {this.state.showBothSides
              ? "Show one side only"
              : "Show both sides"}
          </Button>
        ) : null}
      </div>
    );
  }

  renderTestsSummary() {
    if (this.props.tests.allIds.length > 0) {
      const tests = Object.values(this.props.tests.byId).filter(
        test => test.subjectId === this.props.subjectId
      );
      return (
        <div className={styles.testsSummary}>
          <Link to={`/subject/${this.props.subjectId}/tests`}>
            {tests.length} {pluralize("test", tests.length)} for this subject
          </Link>
        </div>
      );
    } else {
      return null;
    }
  }

  render() {
    if (this.props.subjects.allIds.length > 0) {
      const subject = this.props.subjects.byId[this.props.subjectId];
      if (subject) {
        return (
          <div className={styles.cards}>
            <Subheader
              editable
              label={`${subject.title}`}
              onChange={this.onChangeSubjectTitle}
            />
            {this.renderControls()}
            {this.renderTestsSummary()}
            {this.renderCardList()}
          </div>
        );
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
}

Cards.propTypes = {
  dispatch: PropTypes.func.isRequired,
  cards: CARDS_PROPTYPE,
  subjects: SUBJECTS_PROPTYPE,
  tests: TESTS_PROPTYPE,
  subjectId: PropTypes.string,
  testId: PropTypes.string
};

export default connect(Cards.mapStateToProps)(Cards);

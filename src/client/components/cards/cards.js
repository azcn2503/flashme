import React, { PureComponent } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import FlashCard from "../flash-card/flash-card";
import FilterBox from "../filter-box/filter-box";
import Button from "../button/button";

import { addCard, answerTestCard } from "../../state/actions/cards";
import { startTest } from "../../state/actions/tests";

import styles from "./cards.scss";

class Cards extends PureComponent {
  static mapStateToProps(state) {
    return {
      cards: state.cards
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      filter: "",
      showBothSides: false
    };
    this.onClickShowBothSides = this.onClickShowBothSides.bind(this);
    this.onAnswerTestCard = this.onAnswerTestCard.bind(this);
    this.onChangeFilter = this.onChangeFilter.bind(this);
    this.filterCard = this.filterCard.bind(this);
    this.renderCard = this.renderCard.bind(this);
    this.onSelectCard = this.onSelectCard.bind(this);
    this.onSubmitCard = this.onSubmitCard.bind(this);
  }

  componentDidMount() {
    if (this.props.test) {
      this.props.dispatch(startTest(this.props.subjectId, this.props.testId));
    }
  }

  addCard(card) {
    this.props.dispatch(addCard(card, this.props.subjectId));
  }

  onClickShowBothSides() {
    this.setState({
      showBothSides: !this.state.showBothSides
    });
  }

  onChangeCard(key, value) {
    this.props.updateCard(key, value);
  }

  onSelectCard(key, value) {
    this.props.selectCard(key, value);
  }

  onChangeFilter(e) {
    this.setState({
      filter: e.target.value
    });
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
              card={this.state.cards[this.props.test.activeCardIndex]}
              onContinue={this.onAnswerTestCard}
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

  filterCard(card) {
    const filter = this.state.filter.toLowerCase();
    return (
      card.subjectIds.includes(this.props.subjectId) &&
      (card.question.toLowerCase().includes(filter) ||
        card.answer.toLowerCase().includes(filter))
    );
  }

  renderCard(card, key) {
    return (
      <FlashCard
        key={key}
        card={card}
        showBothSides={this.state.showBothSides}
        selected={card.selected}
        onSelect={selected => this.onSelectCard(key, selected)}
      />
    );
  }

  renderCardList() {
    return (
      <div className={styles.cardList}>
        <FlashCard
          card={{}}
          onSubmit={this.onSubmitCard}
          editable
          showBothSides={this.state.showBothSides}
        />
        {this.props.cards
          ? Object.values(this.props.cards.byId)
              .filter(this.filterCard)
              .map(this.renderCard)
          : null}
      </div>
    );
  }

  renderFilters() {
    if (!this.props.test) {
      return (
        <FilterBox
          onChange={this.onChangeFilter}
          value={this.state.filter}
          type="cards"
          totalCount={this.state.cards.length}
          filteredCount={this.state.cards.filter(this.filterCard).length}
        />
      );
    } else {
      return null;
    }
  }

  renderControls() {
    debugger;
    const selected = Object.values(this.props.cards.byId).filter(
      card => card.selected
    );
    return (
      <div className={styles.controls}>
        {!this.props.test ? (
          <Button onClick={this.onClickShowBothSides} primary>
            {this.state.showBothSides
              ? "Show one side only"
              : "Show both sides"}
          </Button>
        ) : null}
        {selected.length > 0 ? (
          <Button>Do something with your {selected.length} cards</Button>
        ) : null}
        {this.renderFilters()}
      </div>
    );
  }

  render() {
    return (
      <div className={styles.cards}>
        {/* {this.renderControls()} */}
        {this.props.test ? this.renderTestContainer() : this.renderCardList()}
      </div>
    );
  }
}

Cards.propTypes = {
  cards: PropTypes.object,
  test: PropTypes.object,
  subjectId: PropTypes.string,
  testId: PropTypes.string
};

export default connect(Cards.mapStateToProps)(Cards);

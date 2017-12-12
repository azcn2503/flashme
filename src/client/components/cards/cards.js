import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import FlashCard from "../flash-card/flash-card";
import FilterBox from "../filter-box/filter-box";
import Button from "../button/button";

import styles from "./cards.scss";

class Cards extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      filter: "",
      showBothSides: false,
      testCard: 0,
      correct: 0
    };
    this.onClickShowBothSides = this.onClickShowBothSides.bind(this);
    this.onContinueTest = this.onContinueTest.bind(this);
    this.onChangeFilter = this.onChangeFilter.bind(this);
    this.filterCard = this.filterCard.bind(this);
    this.renderCard = this.renderCard.bind(this);
    this.onSelectCard = this.onSelectCard.bind(this);
  }

  componentDidUpdate(nextProps) {
    if (nextProps.test !== this.props.test && this.props.test) {
      this.setState({
        testCard: 0
      });
    }
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

  onSubmitCard(key, value) {
    if (!key) {
      this.props.addCard(value);
    } else {
      this.props.updateCard(key, value);
    }
  }

  onContinueTest(status) {
    this.setState({
      testCard: this.state.testCard + 1,
      correct: status ? this.state.correct + 1 : this.state.correct
    });
  }

  renderTestContainer() {
    if (this.props.cards.length === 0) {
      return <div className={styles.testContainer}>Nothing to test!</div>;
    } else if (this.state.testCard < this.props.cards.length) {
      return (
        <div className={styles.testContainer}>
          <div className={styles.progressContainer}>
            <div
              className={styles.progressBar}
              style={{
                width: `${Math.floor(
                  100 / this.props.cards.length * (this.state.testCard + 1)
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
            Card {this.state.testCard + 1} of {this.props.cards.length}
          </div>
          <div className={styles.testCard}>
            <FlashCard
              question={this.props.cards[this.state.testCard].question}
              answer={this.props.cards[this.state.testCard].answer}
              onContinue={this.onContinueTest}
              test
            />
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.testContainer}>
          Test completed - you scored {this.state.correct} of{" "}
          {this.state.testCard} ({Math.floor(
            100 / this.state.testCard * this.state.correct
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
      card.question.toLowerCase().includes(filter) ||
      card.answer.toLowerCase().includes(filter)
    );
  }

  renderCard(card, key) {
    return (
      <FlashCard
        key={key}
        question={card.question}
        answer={card.answer}
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
          onChange={value => this.onChangeCard(null, value)}
          onSubmit={value => this.onSubmitCard(null, value)}
          editable
          showBothSides={this.state.showBothSides}
        />
        {this.props.cards.filter(this.filterCard).map(this.renderCard)}
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
          totalCount={this.props.cards.length}
          filteredCount={this.props.cards.filter(this.filterCard).length}
        />
      );
    } else {
      return null;
    }
  }

  renderControls() {
    const selected = this.props.cards.filter(card => card.selected);
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
        {this.renderControls()}
        {this.props.test ? this.renderTestContainer() : this.renderCardList()}
      </div>
    );
  }
}

Cards.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.object).isRequired,
  addCard: PropTypes.func,
  updateCard: PropTypes.func,
  removeCard: PropTypes.func,
  selectCard: PropTypes.func,
  test: PropTypes.bool,
  testName: PropTypes.string
};

Cards.defaultProps = {
  addCard: () => null,
  updateCard: () => null,
  removeCard: () => null,
  selectCard: () => null,
  test: false,
  testName: "Test"
};

export default Cards;

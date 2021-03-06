import React, { PureComponent } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { debounce, values } from "lodash";

import {
  CARDS_PROPTYPE,
  SUBJECTS_PROPTYPE,
  TESTS_PROPTYPE
} from "client/proptypes";
import { getSubject, updateSubjectTitle } from "client/state/actions/subjects";
import { getCards, addCard } from "client/state/actions/cards";
import { getTestsForSubject, startTest } from "client/state/actions/tests";
import FlashCard from "client/components/flash-card/flash-card";
import FilterBox from "client/components/filter-box/filter-box";
import Button from "client/components/button/button";
import Subheader from "client/components/subheader/subheader";

import styles from "./subject-cards.scss";

class SubjectCards extends PureComponent {
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
      showBothSides: false,
      ready: true
    };
    this.onClickTestsButton = this.onClickTestsButton.bind(this);
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
        cards: values(this.props.cards.byId).filter(this.filterCardsBySubject)
      });
    }
  }

  getTestsForSubject() {
    if (this.props.tests.allIds.length === 0 || !this.props.tests.requesting) {
      this.props.dispatch(getTestsForSubject(this.props.subjectId));
    }
  }

  getSubject() {
    if (!this.props.subjects.byId[this.props.subjectId]) {
      this.props.dispatch(getSubject(this.props.subjectId));
    }
  }

  getCards() {
    if (
      this.props.cards.allIds.length === 0 ||
      !values(this.props.cards.byId).find(
        card => card.subjectId === this.props.subjectId
      )
    ) {
      this.props.dispatch(getCards(this.props.subjectId));
    }
  }

  addCard(card) {
    this.props.dispatch(addCard(card, this.props.subjectId));
  }

  onClickTestsButton() {
    this.props.history.push(`/subject/${this.props.subjectId}/tests`);
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
        key={card.id || key}
        card={card}
        subjectId={this.props.subjectId}
        showBothSides={this.state.showBothSides}
        selected={card.selected}
        editable
        showDialog={this.props.showDialog}
        hideDialog={this.props.hideDialog}
      />
    );
  }

  renderCardList() {
    const cards = values(this.props.cards.byId)
      .filter(this.filterCardsBySubject)
      .filter(this.filterCardsBySearchTerm);
    return (
      <div className={styles.cardList}>
        <FlashCard
          key="input"
          dispatch={this.props.dispatch}
          card={{}}
          subjectId={this.props.subjectId}
          editable
          showBothSides={this.state.showBothSides}
          showDialog={this.props.showDialog}
          hideDialog={this.props.hideDialog}
        />
        {this.props.cards ? cards.map(this.renderCard) : null}
      </div>
    );
  }

  renderFilters() {
    if (!this.props.test) {
      const subjectCards = values(this.props.cards.byId).filter(
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
    const selected = values(this.props.cards.byId).filter(
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

  renderSubheader() {
    const subject = this.props.subjects.byId[this.props.subjectId];
    return (
      <div className={styles.subheader}>
        <Subheader
          editable
          label={subject ? subject.title : ""}
          onChange={this.onChangeSubjectTitle}
        />
        {this.renderControls()}
      </div>
    );
  }

  render() {
    return (
      <div className={styles.subjectCards}>
        {this.renderSubheader()}
        {this.renderCardList()}
      </div>
    );
  }
}

SubjectCards.propTypes = {
  dispatch: PropTypes.func.isRequired,
  cards: CARDS_PROPTYPE,
  subjects: SUBJECTS_PROPTYPE,
  tests: TESTS_PROPTYPE,
  subjectId: PropTypes.string,
  testId: PropTypes.string,
  showDialog: PropTypes.func,
  hideDialog: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func
  })
};

export default withRouter(connect(SubjectCards.mapStateToProps)(SubjectCards));

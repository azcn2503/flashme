import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

import { SUBJECT_PROPTYPE, CARDS_PROPTYPE } from "../../proptypes";
import Button from "../button/button";

import { removeSubject } from "../../state/actions/subjects";
import { addTest } from "../../state/actions/tests";

import styles from "./subject-card.scss";

class SubjectCard extends PureComponent {
  static mapStateToProps(state) {
    return {
      cards: state.cards
    };
  }

  constructor(props) {
    super(props);
    this.onClickDelete = this.onClickDelete.bind(this);
    this.onClickTest = this.onClickTest.bind(this);
    this._fakeCards = [];
  }

  componentDidMount() {
    this.scatterFakeCards();
  }

  onClickDelete() {
    this.props.dispatch(removeSubject(this.props.subject.id));
  }

  onClickTest() {
    this.props.dispatch(addTest(this.props.subject.id));
  }

  /**
   * Randomly scatters the fake cards behind the subject card
   */
  scatterFakeCards() {
    if (this._fakeCards.length > 0) {
      setTimeout(() => {
        this._fakeCards.forEach(fakeCard => {
          const rotateAmount = Math.round(Math.random() * 6 - 3);
          fakeCard.style.transform = `rotateZ(${rotateAmount}deg`;
        });
      });
    }
  }

  renderFakeCards() {
    return [
      <div
        className={styles.fakeCard}
        key="fakeCard-0"
        ref={el => this._fakeCards.push(el)}
      />,
      <div
        className={styles.fakeCard}
        key="fakeCard-1"
        ref={el => this._fakeCards.push(el)}
      />
    ];
  }

  render() {
    if (this.props.subject) {
      return (
        <div className={styles.subjectCardContainer}>
          {this.renderFakeCards()}
          <div className={styles.subjectCard}>
            <div className={styles.title}>
              <NavLink to={`/subject/${this.props.subject.id}`}>
                {this.props.subject.title}
              </NavLink>
              <span className={styles.count}>
                ({Object.keys(this.props.cards.byId).filter(
                  card => card.subjectId === this.props.subject.id
                ).length ||
                  this.props.subject.cardCount ||
                  0})
              </span>
            </div>
            <div className={styles.controls}>
              <Button primary onClick={this.onClickTest}>
                Test
              </Button>
              <Button delete onClick={this.onClickDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

SubjectCard.propTypes = {
  subject: SUBJECT_PROPTYPE,
  cards: CARDS_PROPTYPE,
  dispatch: PropTypes.func.isRequired
};

SubjectCard.defaultProps = {
  active: false,
  onChange: () => null
};

export default connect(SubjectCard.mapStateToProps)(SubjectCard);

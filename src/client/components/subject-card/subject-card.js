import React, { PureComponent } from "react";
import { connect } from "react-redux";
import classNames from "classnames";
import { NavLink, withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import { SUBJECT_PROPTYPE, CARDS_PROPTYPE } from "../../proptypes";
import Button from "../button/button";

import {
  updateSubjectTitle,
  removeSubject
} from "../../state/actions/subjects";
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
    this.onBlur = this.onBlur.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
    this.onClickTest = this.onClickTest.bind(this);
    this.el = null;
  }

  onBlur() {
    if (this.el) {
      this.props.dispatch(updateSubjectTitle(this.props.id, this.value()));
    }
  }

  onClickDelete() {
    this.props.dispatch(removeSubject(this.props.id));
  }

  onClickTest() {
    // this.props
    //   .dispatch(
    //     addTest(
    //       this.props.id,
    //       Object.values(this.props.cards.byId).filter(card =>
    //         card.subjectIds.includes(this.props.id)
    //       )
    //     )
    //   )
    //   .then(test => {
    //     console.log("test", test);
    //     this.props.history.push(`/subject/${this.props.id}/test/${test.id}`);
    //   });
  }

  getTitleMarkup() {
    return {
      __html: this.props.title
    };
  }

  value() {
    if (this.el) {
      return this.el.textContent;
    }
  }

  renderLink() {
    return (
      <NavLink to={`/subject/${this.props.id}`}>{this.props.title}</NavLink>
    );
  }

  renderTitle() {
    return (
      <div
        contentEditable
        dangerouslySetInnerHTML={this.getTitleMarkup()}
        onBlur={this.onBlur}
        ref={el => (this.el = el)}
      />
    );
  }

  render() {
    if (this.props.subject) {
      return (
        <div className={styles.subjectCard}>
          <div className={styles.title}>
            <NavLink to={`/subject/${this.props.subject.id}`}>
              {this.props.subject.title}
            </NavLink>
            <span className={styles.count}>
              ({Object.keys(this.props.cards.byId).filter(
                card => card.subjectId === this.props.subject.id
              ).length || this.props.subject.cardCount})
            </span>
          </div>
          <div className={styles.controls} />
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

export default withRouter(connect(SubjectCard.mapStateToProps)(SubjectCard));

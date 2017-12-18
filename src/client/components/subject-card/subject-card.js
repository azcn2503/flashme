import React, { PureComponent } from "react";
import { connect } from "react-redux";
import classNames from "classnames";
import { NavLink, withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import Button from "../button/button";

import { updateSubjectTitle } from "../../state/actions/subjects";
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
    this.onClickTest = this.onClickTest.bind(this);
    this.el = null;
  }

  onBlur() {
    if (this.el) {
      this.props.dispatch(updateSubjectTitle(this.props.id, this.value()));
    }
  }

  onClickTest() {
    this.props
      .dispatch(
        addTest(
          this.props.id,
          Object.values(this.props.cards.byId).filter(card =>
            card.subjectIds.includes(this.props.id)
          )
        )
      )
      .then(testId =>
        this.props.history.push(`/subject/${this.props.id}/test/${testId}`)
      );
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
    return (
      <div
        className={classNames(styles.subjectCard, {
          [styles.active]: this.props.active
        })}
      >
        <div className={styles.title}>
          <div className={styles.label}>
            {this.props.active ? this.renderTitle() : this.renderLink()}
          </div>
          <div className={styles.count}>({this.props.count})</div>
        </div>
        <div className={styles.controls}>
          <Button disabled={this.props.count === 0} onClick={this.onClickTest}>
            Test
          </Button>
        </div>
      </div>
    );
  }
}

SubjectCard.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string,
  count: PropTypes.number,
  active: PropTypes.bool,
  onChange: PropTypes.func,
  dispatch: PropTypes.func.isRequired
};

SubjectCard.defaultProps = {
  title: "",
  count: 0,
  active: false,
  onChange: () => null
};

export default withRouter(connect(SubjectCard.mapStateToProps)(SubjectCard));

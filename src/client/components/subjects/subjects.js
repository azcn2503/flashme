import React, { PureComponent } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Subheader from "../subheader/subheader";
import SubjectCard from "../subject-card/subject-card";
import { getSubjects } from "../../state/actions/subjects";

import styles from "./subjects.scss";
import { SUBJECTS_PROPTYPE } from "../../proptypes";

class Subjects extends PureComponent {
  static mapStateToProps(state) {
    return {
      cards: state.cards,
      subjects: state.subjects
    };
  }

  componentDidMount() {
    this.props.dispatch(getSubjects());
  }

  renderSubjects() {
    return Object.values(this.props.subjects.byId).map((subject, key) => (
      <SubjectCard key={key} subject={subject} />
    ));
  }

  render() {
    return (
      <div className={styles.subjects}>
        <Subheader label={`Subjects (${this.props.subjects.allIds.length})`} />
        <div className={styles.subjectList}>{this.renderSubjects()}</div>
      </div>
    );
  }
}

Subjects.propTypes = {
  subjects: SUBJECTS_PROPTYPE
};

export default connect(Subjects.mapStateToProps)(Subjects);

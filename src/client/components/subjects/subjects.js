import React, { PureComponent } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Subheader from "../subheader/subheader";

import { getSubjects } from "../../state/actions/subjects";

import styles from "./subjects.scss";

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

  render() {
    return (
      <div className={styles.subjects}>
        <Subheader label="Subjects" />
      </div>
    );
  }
}

export default connect(Subjects.mapStateToProps)(Subjects);

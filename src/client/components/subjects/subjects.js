import React, { PureComponent } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Subheader from "../subheader/subheader";

import styles from "./subjects.scss";

class Subjects extends PureComponent {
  static mapStateToProps(state) {
    return {
      cards: state.cards,
      subjects: state.subjects
    };
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

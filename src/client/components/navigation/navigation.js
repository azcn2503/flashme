import React, { PureComponent } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Switch, Route, Link } from "react-router-dom";

import { SUBJECTS_PROPTYPE, CARDS_PROPTYPE } from "../../proptypes";

import styles from "./navigation.scss";

class Navigation extends PureComponent {
  static mapStateToProps(state) {
    return {
      cards: state.cards,
      subjects: state.subjects
    };
  }

  renderRoute() {
    const { subjectId, testId } = this.props.routerProps.match.params;
    if (subjectId) {
      const subject = this.props.subjects.byId[subjectId];
      if (subject) {
        return [
          <Link to="/subjects">Subjects</Link>,
          <div>&gt;</div>,
          <Link to={`/subject/${subjectId}`}>{subject.title}</Link>
        ];
      } else {
        return <Link to="/subjects">Subjects</Link>;
      }
    } else {
      return <Link to="/subjects">Subjects</Link>;
    }
  }

  render() {
    return <div className={styles.navigation}>{this.renderRoute()}</div>;
  }
}

Navigation.propTypes = {
  cards: CARDS_PROPTYPE,
  subjects: SUBJECTS_PROPTYPE,
  routerProps: PropTypes.object,
  dispatch: PropTypes.func.isRequired
};

export default connect(Navigation.mapStateToProps)(Navigation);

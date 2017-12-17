import React, { PureComponent } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Switch, Route, Link } from "react-router-dom";

import SubjectsList from "../subjects-list/subjects-list";

import styles from "./navigation.scss";

class Navigation extends PureComponent {
  static mapStateToProps(state) {
    return {
      subjects: state.subjects.subjects
    };
  }

  render() {
    return (
      <div className={styles.navigation}>
        <div className={styles.header}>Cards</div>
        <Link className={styles.navItem} to="/cards">
          All Cards
        </Link>
        <div className={styles.header}>
          Subjects ({this.props.subjects.length})
        </div>
        <SubjectsList
          activeId={this.props.routerProps.match.params.id}
          dispatch={this.props.dispatch}
        />
      </div>
    );
  }
}

Navigation.propTypes = {
  subjects: PropTypes.arrayOf(PropTypes.object),
  addSubject: PropTypes.func,
  removeSubject: PropTypes.func,
  updateSubject: PropTypes.func,
  routerProps: PropTypes.object,
  dispatch: PropTypes.func.isRequired
};

export default connect(Navigation.mapStateToProps)(Navigation);

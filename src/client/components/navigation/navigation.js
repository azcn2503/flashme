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
      subjects: state.subjects,
      tests: state.tests
    };
  }

  renderSegment(path, url, index) {
    switch (path) {
      case "subject":
      case "subjects":
        return <Link to="../subjects">Subjects</Link>;
      case ":subjectId":
        const subject = this.props.subjects.byId[url];
        if (subject) {
          return <Link to={`../subject/${url}`}>{subject.title}</Link>;
        } else {
          return null;
        }
      case "test":
      case "tests":
        return <Link to="../tests">Tests</Link>;
      case ":testId":
        const test = this.props.tests.byId[url];
        if (test) {
          return <Link to={`../test/${url}`}>{test.id}</Link>;
        } else {
          return null;
        }
      default:
        return null;
    }
  }

  renderSeparator(index, length) {
    if (index < length - 1) {
      return <div key={index}>&gt;</div>;
    } else {
      return null;
    }
  }

  renderRoute() {
    const { path, url } = this.props.routerProps.match;
    const splitPath = path.split("/");
    const splitUrl = url.split("/");
    return splitPath.map((p, key) => [
      <div key={`segment-${key}`}>
        {this.renderSegment(splitPath[key], splitUrl[key], key)}
      </div>,
      key > 0 && key < splitPath.length - 1 ? (
        <div key={`separator-${key}`}>&gt;</div>
      ) : null
    ]);
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

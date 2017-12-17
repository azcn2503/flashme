import React, { PureComponent } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

class SubjectTest extends PureComponent {
  render() {
    return null;
  }
}

SubjectTest.propTypes = {
  subjectId: PropTypes.string,
  testId: PropTypes.string,
  cards: PropTypes.array,
  dispatch: PropTypes.func.isRequired
};

export default SubjectTest;

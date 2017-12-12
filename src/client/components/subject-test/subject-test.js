import React, { PureComponent } from "react";
import PropTypes from "prop-types";

class SubjectTest extends PureComponent {
  componentDidMount() {
    this.props.action(this.props.subjectId);
  }

  render() {
    return null;
  }
}

SubjectTest.propTypes = {
  action: PropTypes.func.isRequired
};

export default SubjectTest;

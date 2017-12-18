import React, { PureComponent } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

class Subjects extends PureComponent {
  static mapStateToProps(state) {
    return {
      cards: state.cards,
      subjects: state.subjects
    };
  }

  render() {
    return <div>Subjects</div>;
  }
}

export default connect(Subjects.mapStateToProps)(Subjects);

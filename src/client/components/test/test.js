import React, { PureComponent } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

class Test extends PureComponent {
  static mapStateToProps(state) {
    return {
      tests: state.tests
    };
  }

  render() {
    return (
      <div>
        Test {this.props.testId} ({
          this.props.tests.byId[this.props.testId].cards.length
        }{" "}
        cards)
      </div>
    );
  }
}

Test.propTypes = {
  testId: PropTypes.string
};

export default connect(Test.mapStateToProps)(Test);

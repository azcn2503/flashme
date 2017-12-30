import React, { PureComponent } from "react";
import classNames from "classnames";

import { testStatusEnum } from "shared/tests";
import { TEST_PROPTYPE } from "client/proptypes";

import styles from "./test-status.scss";

class TestStatus extends PureComponent {
  testStatusText(status = testStatusEnum.NOT_STARTED) {
    switch (status) {
      case testStatusEnum.NOT_STARTED:
        return "Not started";
      case testStatusEnum.STARTED:
        return "Started";
      case testStatusEnum.COMPLETED:
        return "Completed";
      case testStatusEnum.ABANDONED:
        return "Abandoned";
      default:
        return status;
    }
  }

  render() {
    const { test } = this.props;
    return (
      <div className={classNames(styles.testStatus, styles[test.status])}>
        {this.testStatusText(test.status)}
      </div>
    );
  }
}

TestStatus.propTypes = {
  test: TEST_PROPTYPE
};

export default TestStatus;

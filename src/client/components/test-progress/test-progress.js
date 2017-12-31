import React, { PureComponent } from "react";

import { TEST_PROPTYPE } from "client/proptypes";

import styles from "./test-progress.scss";

class TestProgress extends PureComponent {
  constructor(props) {
    super(props);
    this._totalProgressBar = null;
    this._correctProgressBar = null;
  }

  componentDidMount() {
    this.updateProgressBars();
  }

  componentDidUpdate() {
    this.updateProgressBars();
  }

  getTestProgressPercent() {
    return Math.round(
      100 /
        (this.props.test.cards.length || 1) *
        (this.props.test.activeCard || 0)
    );
  }

  getTestProgressCorrectPercent() {
    return Math.round(
      100 /
        (this.props.test.cards.length || 1) *
        this.props.test.cards.filter(card => card.correct === true).length
    );
  }

  updateProgressBars() {
    requestAnimationFrame(() => {
      if (this._totalProgressBar && this._correctProgressBar) {
        this._totalProgressBar.style.width = `${this.getTestProgressPercent()}%`;
        this._correctProgressBar.style.width = `${this.getTestProgressCorrectPercent()}%`;
      }
    });
  }

  render() {
    return (
      <div className={styles.testProgress}>
        <div
          className={styles.totalProgressBar}
          ref={el => (this._totalProgressBar = el)}
          style={{ width: 0 }}
        />
        <div
          className={styles.correctProgressBar}
          ref={el => (this._correctProgressBar = el)}
          style={{ width: 0 }}
        />
        <div className={styles.label}>{this.getTestProgressPercent()}%</div>
      </div>
    );
  }
}

TestProgress.propTypes = {
  test: TEST_PROPTYPE
};

export default TestProgress;

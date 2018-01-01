import React, { PureComponent } from "react";
import { debounce } from "lodash";

import { TEST_PROPTYPE } from "client/proptypes";

import styles from "./test-progress.scss";

class TestProgress extends PureComponent {
  constructor(props) {
    super(props);
    this._totalProgressBar = null;
    this._correctProgressBar = null;
    this.onWindowResize = debounce(this.onWindowResize.bind(this), 500);
    this.onTotalProgressBarTransitionEnd = this.onTotalProgressBarTransitionEnd.bind(
      this
    );
    this.onCorrectProgressBarTransitionEnd = this.onCorrectProgressBarTransitionEnd.bind(
      this
    );
  }

  componentDidMount() {
    window.addEventListener("resize", this.onWindowResize);
    if (this._totalProgressBar && this._correctProgressBar) {
      this._totalProgressBar.addEventListener(
        "transitionend",
        this.onTotalProgressBarTransitionEnd
      );
      this._correctProgressBar.addEventListener(
        "transitionend",
        this.onCorrectProgressBarTransitionEnd
      );
    }
    this.updateProgressBars();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.test.activeCard !== this.props.test.activeCard) {
      this.updateProgressBars();
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onWindowResize);
  }

  onTotalProgressBarTransitionEnd() {
    this.updateTotalProgressLabel();
  }

  onCorrectProgressBarTransitionEnd() {
    this.updateCorrectProgressLabel();
  }

  onWindowResize() {
    this.updateProgressBars();
  }

  getTotalProgressPercent() {
    return Math.round(
      100 /
        (this.props.test.cards.length || 1) *
        (this.props.test.activeCard || 0)
    );
  }

  getCorrectProgressPercent() {
    return Math.round(
      100 /
        (this.props.test.cards.length || 1) *
        this.props.test.cards.filter(card => card.correct === true).length
    );
  }

  updateTotalProgressLabel() {
    const correctProgressBar = this._correctProgressBar.getBoundingClientRect();
    const totalBarRect = this._totalProgressBar.getBoundingClientRect();
    const totalLabelRect = this._totalProgressLabel.getBoundingClientRect();
    if (
      totalLabelRect.left > totalBarRect.left &&
      totalLabelRect.left > correctProgressBar.right
    ) {
      this._totalProgressLabel.classList.add(styles.visible);
    } else {
      this._totalProgressLabel.classList.remove(styles.visible);
    }
  }

  updateCorrectProgressLabel() {
    const correctBarRect = this._correctProgressBar.getBoundingClientRect();
    const correctLabelRect = this._correctProgressLabel.getBoundingClientRect();
    if (correctLabelRect.left > correctBarRect.left) {
      this._correctProgressLabel.classList.add(styles.visible);
    } else {
      this._correctProgressLabel.classList.remove(styles.visible);
    }
  }

  updateProgressBars() {
    setTimeout(() => {
      if (
        this._totalProgressBar &&
        this._correctProgressBar &&
        this._totalProgressLabel &&
        this._correctProgressLabel
      ) {
        this._totalProgressBar.style.width = `${this.getTotalProgressPercent()}%`;
        this._correctProgressBar.style.width = `${this.getCorrectProgressPercent()}%`;
        this.updateTotalProgressLabel();
        this.updateCorrectProgressLabel();
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
        >
          <div
            className={styles.totalProgressLabel}
            ref={el => (this._totalProgressLabel = el)}
          >
            {this.getTotalProgressPercent()}%
          </div>
        </div>
        <div
          className={styles.correctProgressBar}
          ref={el => (this._correctProgressBar = el)}
          style={{ width: 0 }}
        >
          <div
            className={styles.correctProgressLabel}
            ref={el => (this._correctProgressLabel = el)}
          >
            {this.getCorrectProgressPercent()}%
          </div>
        </div>
      </div>
    );
  }
}

TestProgress.propTypes = {
  test: TEST_PROPTYPE
};

export default TestProgress;

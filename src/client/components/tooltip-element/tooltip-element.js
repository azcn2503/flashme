import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classNames from "classnames";

import styles from "./tooltip-element.scss";

class TooltipElement extends PureComponent {
  static mapStateToProps(state) {
    const { open, message, left, top, width, height } = state.tooltip;
    return {
      open,
      message,
      left,
      top,
      width,
      height
    };
  }

  constructor(props) {
    super(props);
    this._tooltip = null;
  }

  componentDidUpdate() {
    if (this._tooltip) {
      const tooltipBox = this._tooltip.getBoundingClientRect();
      const bodyBox = document.body.getBoundingClientRect();
      let left = this.props.left + this.props.width / 2 - tooltipBox.width / 2;
      if (left < 0) {
        left = 0;
      } else if (left + tooltipBox.width > bodyBox.width) {
        left = bodyBox.width - tooltipBox.width;
      }
      let top = this.props.top + this.props.height + 10;
      if (top < 0) {
        top = 0;
      } else if (top + tooltipBox.height > bodyBox.height) {
        top = bodyBox.height - tooltipBox.height;
      }
      this._tooltip.style.left = `${left}px`;
      this._tooltip.style.top = `${top}px`;
    }
  }

  render() {
    return (
      <div
        ref={el => (this._tooltip = el)}
        className={classNames(styles.tooltipElement, {
          [styles.open]: this.props.open
        })}
      >
        {this.props.message}
      </div>
    );
  }
}

TooltipElement.propTypes = {
  message: PropTypes.string,
  open: PropTypes.bool,
  left: PropTypes.number,
  top: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number
};

export default connect(TooltipElement.mapStateToProps)(TooltipElement);

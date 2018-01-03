import React, { PureComponent } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import classNames from "classnames";

import { showTooltip, hideTooltip } from "client/state/actions/tooltip";

import styles from "./tooltip.scss";

class TooltipClass extends PureComponent {
  static mapStateToProps(state) {
    const { open } = state.tooltip;
    return { open };
  }

  constructor(props) {
    super(props);
    this._refs = [];
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
  }

  componentDidMount() {
    this.addListeners();
  }

  componentWillUpdate() {
    this.removeListeners();
  }

  componentDidUpdate(prevProps) {
    this.addListeners();
    if (prevProps.disabled !== this.props.disabled && this.props.disabled) {
      this.props.dispatch(hideTooltip());
    }
  }

  componentWillUnmount() {
    this.removeListeners();
  }

  addListeners() {
    if (this._refs.length > 0) {
      this._refs.map(ReactDOM.findDOMNode).forEach(el => {
        el.addEventListener("mouseover", this.onMouseOver);
        el.addEventListener("mouseout", this.onMouseOut);
      });
    }
  }

  removeListeners() {
    if (this._refs.length > 0) {
      this._refs.map(ReactDOM.findDOMNode).forEach(el => {
        el.removeEventListener("mouseover", this.onMouseOver);
        el.removeEventListener("mouseout", this.onMouseOut);
      });
    }
  }

  onMouseOver(e) {
    if (e.target && !this.props.disabled && !this.props.open) {
      const targetBox = e.target.getBoundingClientRect();
      const { x, y, width, height } = targetBox;
      this.props.dispatch(
        showTooltip({ x, y, width, height, message: this.props.message })
      );
    }
  }

  onMouseOut() {
    if (this.props.open) {
      this.props.dispatch(hideTooltip());
    }
  }

  render() {
    return React.Children.map(this.props.children, (child, key) =>
      React.cloneElement(child, {
        ref: el => (this._refs[key] = el)
      })
    );
  }
}

class TooltipElementClass extends PureComponent {
  static mapStateToProps(state) {
    const { open, message, x, y, width, height } = state.tooltip;
    return {
      open,
      message,
      x,
      y,
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
      let left = this.props.x + this.props.width / 2 - tooltipBox.width / 2;
      if (left < 0) {
        left = 0;
      } else if (left + tooltipBox.width > bodyBox.width) {
        left = bodyBox.width - tooltipBox.width;
      }
      let top = this.props.y + this.props.height + 10;
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
        className={classNames(styles.tooltip, {
          [styles.open]: this.props.open
        })}
      >
        {this.props.message}
      </div>
    );
  }
}

export const TooltipElement = connect(TooltipElementClass.mapStateToProps)(
  TooltipElementClass
);
export const Tooltip = connect(TooltipClass.mapStateToProps)(TooltipClass);
export default Tooltip;

import React, { PureComponent } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";

import { showTooltip, hideTooltip } from "client/state/actions/tooltip";

class Tooltip extends PureComponent {
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

export default connect(Tooltip.mapStateToProps)(Tooltip);

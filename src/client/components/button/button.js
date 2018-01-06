import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import styles from "./button.scss";

class Button extends PureComponent {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    if (!this.props.disabled && this.props.onClick) {
      this.props.onClick(e);
    }
  }

  render() {
    return (
      <button
        className={classNames(styles.button, {
          [styles.small]: this.props.small,
          [styles.primary]: this.props.primary,
          [styles.delete]: this.props.delete,
          [styles.disabled]: !!this.props.disabled
        })}
        onClick={this.onClick}
        type={this.props.submit ? "submit" : undefined}
      >
        {this.props.children || this.props.value}
      </button>
    );
  }
}

Button.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node,
  value: PropTypes.node,
  primary: PropTypes.bool,
  delete: PropTypes.bool,
  disabled: PropTypes.bool,
  small: PropTypes.bool,
  submit: PropTypes.bool
};

Button.defaultProps = {
  primary: false,
  disabled: false,
  delete: false,
  small: false,
  submit: false
};

export default Button;

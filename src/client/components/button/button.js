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
    if (!this.props.disabled) {
      this.props.onClick(e);
    }
  }

  render() {
    return (
      <button
        className={classNames(styles.button, {
          [styles.primary]: this.props.primary,
          [styles.disabled]: this.props.disabled
        })}
        onClick={this.onClick}
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
  disabled: PropTypes.bool
};

Button.defaultProps = {
  primary: false,
  disabled: false
};

export default Button;

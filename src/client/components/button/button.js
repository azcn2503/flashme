import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import styles from "./button.scss";

class Button extends PureComponent {
  render() {
    return (
      <button
        className={classNames(styles.button, {
          [styles.primary]: this.props.primary
        })}
        onClick={this.props.onClick}
      >
        {this.props.children || this.props.value}
      </button>
    );
  }
}

export default Button;

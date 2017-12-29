import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import styles from "./tab.scss";

class Tab extends PureComponent {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    if (this.props.onClick) {
      this.props.onClick(e);
    }
  }

  render() {
    return (
      <div
        className={classNames(styles.tab, {
          [styles.active]: this.props.active,
          [styles.between]: this.props.between,
          [styles.spacer]: this.props.spacer
        })}
        onClick={this.onClick}
      >
        {this.props.children}
      </div>
    );
  }
}

Tab.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  active: PropTypes.bool,
  spacer: PropTypes.bool,
  between: PropTypes.bool
};

Tab.defaultProps = {
  active: false,
  spacer: false,
  between: false
};

export default Tab;

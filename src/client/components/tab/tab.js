import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import styles from "./tab.scss";

class Tab extends PureComponent {
  render() {
    return <div className={styles.tab}>{this.props.children}</div>;
  }
}

Tab.propTypes = {
  children: PropTypes.node
};

export default Tab;

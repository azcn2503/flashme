import React, { PureComponent } from "react";

import styles from "./subheader.scss";

class Subheader extends PureComponent {
  render() {
    return <div className={styles.subheader}>{this.props.label}</div>;
  }
}

export default Subheader;

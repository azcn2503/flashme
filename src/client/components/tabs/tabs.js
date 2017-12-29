import React, { PureComponent } from "react";

import styles from "./tabs.scss";

class Tabs extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeTabId: null
    };
  }

  render() {
    return (
      <div className={styles.tabs}>
        {React.Children.map(this.props.children, (child, key) =>
          React.cloneElement(child, { tabId: key })
        )}
      </div>
    );
  }
}

export default Tabs;

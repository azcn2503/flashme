import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import Tab from "client/components/tab/tab";

import styles from "./tabs.scss";

class Tabs extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeTabId: props.active || null
    };
    this.onClickTab = this.onClickTab.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.activeTabId !== this.state.activeTabId) {
      if (this.props.onChange) {
        this.props.onChange(this.state.activeTabId);
      }
    }
  }

  onClickTab(tabId) {
    this.setState({
      activeTabId: tabId
    });
  }

  render() {
    return (
      <div className={styles.tabs}>
        <Tab spacer />
        {React.Children.map(this.props.children, (child, key) => {
          const tabId = child.props.value || key;
          return [
            React.cloneElement(child, {
              tabId,
              onClick: () => this.onClickTab(tabId),
              active: this.state.activeTabId === tabId
            }),
            key < this.props.children.length - 1 ? <Tab between /> : null
          ];
        })}
        <Tab spacer />
      </div>
    );
  }
}

Tabs.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element),
  onChange: PropTypes.func
};

export default Tabs;

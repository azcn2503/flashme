import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import EditableContent from "../editable-content/editable-content";

import styles from "./subheader.scss";

class Subheader extends PureComponent {
  render() {
    return (
      <EditableContent
        className={styles.subheader}
        value={this.props.label}
        editable={this.props.editable}
        onChange={this.props.onChange}
        blurOnEnter={this.props.editable}
      />
    );
  }
}

Subheader.propTypes = {
  label: PropTypes.string,
  editable: PropTypes.bool,
  onChange: PropTypes.func
};

export default Subheader;

import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import styles from "./subheader.scss";

class Subheader extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      focused: false
    };
    this._el = null;
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  onFocus() {
    if (this.props.editable) {
      this.setState({
        focused: true
      });
    }
  }

  onBlur() {
    if (this.props.editable) {
      this.setState({
        focused: false
      });
      this.props.onChange(this.getValue());
    }
  }

  getMarkup() {
    return {
      __html: this.props.label
    };
  }

  getValue() {
    if (this._el) {
      return this._el.textContent;
    } else {
      return this.props.label;
    }
  }

  render() {
    return (
      <div
        ref={el => (this._el = el)}
        className={styles.subheader}
        contentEditable={this.props.editable}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        dangerouslySetInnerHTML={this.getMarkup()}
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

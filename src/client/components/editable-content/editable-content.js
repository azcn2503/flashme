import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import styles from "./editable-content.scss";

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
      __html: this.props.value
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
        className={classNames(styles.editableContent, this.props.className)}
        contentEditable={this.props.editable}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        dangerouslySetInnerHTML={this.getMarkup()}
      />
    );
  }
}

Subheader.propTypes = {
  className: PropTypes.string,
  value: PropTypes.string,
  editable: PropTypes.bool,
  onChange: PropTypes.func
};

export default Subheader;

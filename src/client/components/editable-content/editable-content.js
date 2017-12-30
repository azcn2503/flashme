import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import styles from "./editable-content.scss";

class EditableContent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      focused: false,
      value: props.value
    };
    this._el = null;
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value && !this.state.focused) {
      this.setState({
        value: nextProps.value
      });
    }
  }

  onFocus(e) {
    if (this.props.editable) {
      this.setState({
        focused: true
      });
      if (this.props.onFocus) {
        this.props.onFocus(e);
      }
    }
  }

  onBlur(e) {
    if (this.props.editable) {
      this.setState({
        focused: false
      });
      if (this.props.onBlur) {
        this.props.onBlur(e);
      }
    }
  }

  onKeyDown(e) {
    if (this.props.editable) {
      if (this.props.blurOnEnter && e.keyCode === 13) {
        this.blur();
      }
      if (this.props.onKeyDown) {
        this.props.onKeyDown(e);
      }
    }
  }

  onKeyUp(e) {
    if (this.props.editable) {
      this.props.onChange(this.getValue());
      if (this.props.onKeyUp) {
        this.props.onKeyUp(e);
      }
    }
  }

  getMarkup() {
    return {
      __html: this.state.value
    };
  }

  getValue() {
    if (this._el) {
      return this._el.innerHTML;
    } else {
      return this.state.value;
    }
  }

  focus() {
    if (this._el) {
      this._el.focus();
    }
  }

  blur() {
    if (this._el) {
      this._el.blur();
    }
  }

  render() {
    return (
      <div
        ref={el => (this._el = el)}
        className={classNames(
          styles.editableContent,
          { [styles.editable]: this.props.editable },
          this.props.className
        )}
        contentEditable={this.props.editable}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onKeyUp={this.onKeyUp}
        onKeyDown={this.onKeyDown}
        dangerouslySetInnerHTML={this.getMarkup()}
      />
    );
  }
}

EditableContent.propTypes = {
  className: PropTypes.string,
  value: PropTypes.string,
  editable: PropTypes.bool,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  blurOnEnter: PropTypes.bool
};

EditableContent.defaultProps = {
  blurOnEnter: false
};

export default EditableContent;

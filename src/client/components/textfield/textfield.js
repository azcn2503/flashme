import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import styles from "./textfield.scss";

const typesEnum = {
  TEXT: "text",
  PASSWORD: "password"
};

class TextField extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value
    };
    this.onChange = this.onChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({
        value: nextProps.value
      });
    }
  }

  onChange(e) {
    this.setState({
      value: e.target.value
    });
    if (this.props.onChange) {
      this.props.onChange(e);
    }
  }

  render() {
    return (
      <input
        className={classNames(styles.textField, this.props.className, {
          [styles.fullWidth]: this.props.fullWidth
        })}
        type={this.props.type}
        defaultValue={this.props.value}
        onChange={this.onChange}
        placeholder={this.props.placeholder}
        autoComplete={this.props.autoComplete ? "on" : "off"}
      />
    );
  }
}

TextField.propTypes = {
  className: PropTypes.string,
  type: PropTypes.oneOf(Object.values(typesEnum)),
  value: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  fullWidth: PropTypes.bool,
  autoComplete: PropTypes.bool
};

TextField.defaultProps = {
  type: typesEnum.TEXT,
  value: "",
  placeholder: "",
  fullWidth: false,
  autoComplete: false
};

export default TextField;

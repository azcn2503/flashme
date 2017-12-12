import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

import styles from "./filter-box.scss";

class FilterBox extends PureComponent {
  constructor(props) {
    super(props);
  }

  renderSummary() {
    return (
      <div
        className={classNames(styles.summary, {
          [styles.visible]: this.props.value !== ""
        })}
      >
        ({this.props.filteredCount} of {this.props.totalCount})
      </div>
    );
  }

  render() {
    return (
      <div className={styles.filterBox}>
        <input
          defaultValue={this.props.value}
          className={styles.input}
          onChange={this.props.onChange}
          placeholder={`Filter ${this.props.type}`}
        />
        {this.renderSummary()}
      </div>
    );
  }
}

FilterBox.propTypes = {
  value: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func,
  totalCount: PropTypes.number,
  filteredCount: PropTypes.number,
  type: PropTypes.string
};

FilterBox.defaultProps = {
  value: "",
  type: "items"
};

export default FilterBox;

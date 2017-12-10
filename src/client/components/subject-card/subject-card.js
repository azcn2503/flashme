import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

import styles from './subject-card.scss';

class SubjectCard extends PureComponent {
  getTitleMarkup() {
    return {
      __html: this.props.title
    };
  }

  renderLink() {
    return (
      <NavLink
        to={`/subject/${this.props.id}`}
      >
        {this.props.title}
      </NavLink>
    );
  }

  renderTitle() {
    return (
      <div
        contentEditable
        dangerouslySetInnerHTML={this.getTitleMarkup()}
      />
    );
  }

  render() {
    return (
      <div
        className={classNames(styles.subjectCard, {
          [styles.active]: this.props.active
        })}
      >
        <div className={styles.title}>
          <div className={styles.label}>
            {
              this.props.active ? this.renderTitle() : this.renderLink()
            }
          </div>
          <div className={styles.count}>
            ({this.props.count})
          </div>
        </div>
        <div className={styles.controls}>
          <button
            disabled={this.props.count === 0}
          >
            Test
          </button>
        </div>
      </div>
    );
  }
}

SubjectCard.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string,
  count: PropTypes.number,
  active: PropTypes.bool
};

SubjectCard.defaultProps = {
  title: '',
  count: 0,
  active: false
};

export default SubjectCard;

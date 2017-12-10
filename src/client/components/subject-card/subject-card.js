import React, { PureComponent } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

import styles from './subject-card.scss';

class SubjectCard extends PureComponent {
  render() {
    return (
      <div className={styles.subjectCard}>
        <div className={styles.title}>
          <div className={styles.label} contentEditable>
            <NavLink
              to={`/subject/${this.props.id}`}
            >
              {this.props.title}
            </NavLink>
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
  count: PropTypes.number
};

SubjectCard.defaultProps = {
  title: '',
  count: 0
};

export default SubjectCard;

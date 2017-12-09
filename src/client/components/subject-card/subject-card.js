import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import styles from './subject-card.scss';

class SubjectCard extends PureComponent {
  render() {
    return (
      <div className={styles.subjectCard}>
        <div className={styles.title}>
          <div className={styles.label} contentEditable>
            {this.props.label}
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
  title: PropTypes.string,
  count: PropTypes.number
};

SubjectCard.defaultProps = {
  title: '',
  count: 0
};

export default SubjectCard;

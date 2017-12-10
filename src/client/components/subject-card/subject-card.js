import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { NavLink, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import styles from './subject-card.scss';

class SubjectCard extends PureComponent {
  constructor(props) {
    super(props);
    this.onBlur = this.onBlur.bind(this);
    this.onClickTest = this.onClickTest.bind(this);
    this.el = null;
  }

  onBlur() {
    if (this.el) {
      this.props.onChange({
        id: this.props.id,
        title: this.value()
      });
    }
  }

  onClickTest() {
    this.props.history.push(`/subject/${this.props.id}/test`);
  }

  getTitleMarkup() {
    return {
      __html: this.props.title
    };
  }

  value() {
    if (this.el) {
      return this.el.innerHTML;
    }
  }

  renderLink() {
    return (
      <NavLink
        to={`/subject/${this.props.id}/view`}
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
        onBlur={this.onBlur}
        ref={el => (this.el = el)}
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
            onClick={this.onClickTest}
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
  active: PropTypes.bool,
  onChange: PropTypes.func
};

SubjectCard.defaultProps = {
  title: '',
  count: 0,
  active: false,
  onChange: () => null
};

export default withRouter(SubjectCard);

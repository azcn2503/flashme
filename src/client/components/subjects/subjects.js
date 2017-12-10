import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import SubjectCard from '../subject-card/subject-card';

import styles from './subjects.scss';

class Subjects extends PureComponent {
  constructor(props) {
    super(props);
    this.onClickAddSubject = this.onClickAddSubject.bind(this);
  }

  onClickAddSubject() {
    const title = `Subject ${this.props.subjects.length + 1}`;
    this.props.addSubject({
      title: this.subjectTitle(title),
      id: this.subjectId(title)
    });
  }

  subjectTitle(input) {
    return input;
  }

  subjectId(input) {
    return input.toLowerCase().replace(/[^a-z0-9]/g, '-');
  }

  render() {
    return (
      <div className={styles.subjects}>
        <div className={styles.list}>
          {
            this.props.subjects.map((subject, key) => (
              <SubjectCard
                key={key}
                id={subject.id}
                title={subject.title}
                active={subject.id === this.props.activeId}
              />
            ))
          }
        </div>
        <div className={styles.controls}>
          <button onClick={this.onClickAddSubject}>
            Add Subject
          </button>
        </div>
      </div>
    );
  }
}

Subjects.propTypes = {
  subjects: PropTypes.arrayOf(PropTypes.object),
  addSubject: PropTypes.func,
  activeId: PropTypes.string
};

export default Subjects;

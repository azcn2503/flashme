import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import SubjectCard from '../subject-card/subject-card';

import styles from './subjects-list.scss';

class SubjectsList extends PureComponent {
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
      <div className={styles.subjectsList}>
        <div className={styles.controls}>
          <button onClick={this.onClickAddSubject}>
            Add Subject
          </button>
        </div>
        <div className={styles.list}>
          {
            this.props.subjects.map((subject, key) => (
              <SubjectCard
                key={key}
                id={subject.id}
                title={subject.title}
                active={subject.id === this.props.activeId}
                count={this.props.cards.filter(card => card.subjectId === subject.id).length}
                onChange={subject => this.props.updateSubject(key, subject)}
              />
            ))
          }
        </div>
      </div>
    );
  }
}

SubjectsList.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.object),
  subjects: PropTypes.arrayOf(PropTypes.object),
  addSubject: PropTypes.func,
  activeId: PropTypes.string,
  updateSubject: PropTypes.func
};

export default SubjectsList;

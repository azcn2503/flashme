import React, { PureComponent } from 'react';

import SubjectCard from '../subject-card/subject-card';

import styles from './subjects.scss';

class Subjects extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      subjects: []
    };
    this.onClickAddSubject = this.onClickAddSubject.bind(this);
    this.onClickRemoveSubject = this.onClickRemoveSubject.bind(this);
  }

  subjectTitle(input) {
    return input;
  }

  subjectId(input) {
    return input.toLowerCase().replace(/[^a-z0-9]/g, '-');
  }

  onClickAddSubject() {
    const title = `Subject ${this.state.subjects.length + 1}`;
    this.setState({
      subjects: [
        ...this.state.subjects,
        {
          title: this.subjectTitle(title),
          id: this.subjectId(title)
        }
      ]
    });
  }

  onClickRemoveSubject(index) {
    this.setState({
      subjects: [
        ...this.state.subjects.slice(0, index),
        ...this.state.subjects.slice(index + 1)
      ]
    });
  }

  render() {
    return (
      <div className={styles.subjects}>
        <div className={styles.list}>
          {
            this.state.subjects.map((subject, key) => (
              <SubjectCard
                id={subject.id}
                key={key}
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

export default Subjects;

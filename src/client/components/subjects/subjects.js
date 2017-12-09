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

  onClickAddSubject() {
    this.setState({
      subjects: [
        ...this.state.subjects,
        {
          title: 'New subject'
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
                key={key}
                label={subject.title}
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

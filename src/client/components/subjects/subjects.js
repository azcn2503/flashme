import React, { PureComponent } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import FilterBox from "../filter-box/filter-box";
import Button from "../button/button";
import Subheader from "../subheader/subheader";
import SubjectCard from "../subject-card/subject-card";
import { getSubjects, addSubject } from "../../state/actions/subjects";

import styles from "./subjects.scss";
import { SUBJECTS_PROPTYPE } from "../../proptypes";

class Subjects extends PureComponent {
  static mapStateToProps(state) {
    return {
      cards: state.cards,
      subjects: state.subjects
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      filter: ""
    };
    this.filterSubjectBySearchTerm = this.filterSubjectBySearchTerm.bind(this);
    this.onChangeFilter = this.onChangeFilter.bind(this);
    this.onClickAddSubject = this.onClickAddSubject.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(getSubjects());
  }

  onChangeFilter(e) {
    this.setState({
      filter: e.target.value
    });
  }

  onClickAddSubject() {
    this.props.dispatch(addSubject());
  }

  filterSubjectBySearchTerm(subject) {
    const filter = this.state.filter.toLowerCase();
    return subject.title.toLowerCase().includes(filter);
  }

  renderFilters() {
    if (Object.keys(this.props.subjects.byId).length > 0) {
      const filteredSubjects = Object.values(this.props.subjects.byId).filter(
        this.filterSubjectBySearchTerm
      );
      return (
        <FilterBox
          onChange={this.onChangeFilter}
          value={this.state.filter}
          type="subjects"
          totalCount={Object.keys(this.props.subjects.byId).length}
          filteredCount={filteredSubjects.length}
        />
      );
    } else {
      return null;
    }
  }

  renderSubjects() {
    return Object.values(this.props.subjects.byId)
      .filter(this.filterSubjectBySearchTerm)
      .map((subject, key) => <SubjectCard key={key} subject={subject} />);
  }

  render() {
    return (
      <div className={styles.subjects}>
        <Subheader label={`Subjects (${this.props.subjects.allIds.length})`} />
        <div className={styles.controls}>
          {this.renderFilters()}
          <Button primary onClick={this.onClickAddSubject}>
            Add Subject
          </Button>
        </div>
        <div className={styles.subjectList}>{this.renderSubjects()}</div>
      </div>
    );
  }
}

Subjects.propTypes = {
  dispatch: PropTypes.func,
  subjects: SUBJECTS_PROPTYPE
};

export default connect(Subjects.mapStateToProps)(Subjects);

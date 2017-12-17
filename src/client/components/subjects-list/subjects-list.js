import React, { PureComponent } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import SubjectCard from "../subject-card/subject-card";
import FilterBox from "../filter-box/filter-box";
import Button from "../button/button";

import { addSubject } from "../../state/actions/subjects";

import styles from "./subjects-list.scss";

class SubjectsList extends PureComponent {
  static mapStateToProps(state) {
    return {
      subjects: state.subjects.subjects
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      filter: ""
    };
    this.onClickAddSubject = this.onClickAddSubject.bind(this);
    this.onChangeFilter = this.onChangeFilter.bind(this);
    this.filterSubject = this.filterSubject.bind(this);
    this.renderSubject = this.renderSubject.bind(this);
  }

  onChangeFilter(e) {
    this.setState({
      filter: e.target.value
    });
  }

  onClickAddSubject() {
    this.props.dispatch(addSubject());
  }

  subjectTitle(input) {
    return input;
  }

  subjectId(input) {
    return input.toLowerCase().replace(/[^a-z0-9]/g, "-");
  }

  filterSubject(subject) {
    return subject.title
      .toLowerCase()
      .includes(this.state.filter.toLowerCase());
  }

  renderSubject(subject, key) {
    return (
      <SubjectCard
        key={key}
        id={subject.id}
        title={subject.title}
        active={subject.id === this.props.activeId}
        count={this.props.subjects.find(s => s.id === subject.id).cards.length}
        dispatch={this.props.dispatch}
      />
    );
  }

  render() {
    return (
      <div className={styles.subjectsList}>
        <div className={styles.controls}>
          <Button onClick={this.onClickAddSubject} primary>
            Add Subject
          </Button>
        </div>
        <FilterBox
          value={this.state.filter}
          onChange={this.onChangeFilter}
          totalCount={this.props.subjects.length}
          filteredCount={this.props.subjects.filter(this.filterSubject).length}
          type="subjects"
        />
        <div className={styles.list}>
          {this.props.subjects
            .filter(this.filterSubject)
            .map(this.renderSubject)}
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
  updateSubject: PropTypes.func,
  dispatch: PropTypes.func.isRequired
};

export default connect(SubjectsList.mapStateToProps)(SubjectsList);

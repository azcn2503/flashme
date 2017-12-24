import React, { PureComponent } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { CARDS_PROPTYPE, SUBJECTS_PROPTYPE } from "../../proptypes";
import SubjectCard from "../subject-card/subject-card";
import FilterBox from "../filter-box/filter-box";
import Button from "../button/button";

import { addSubject, getSubjects } from "../../state/actions/subjects";

import styles from "./subjects-list.scss";

class SubjectsList extends PureComponent {
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
    this.onClickAddSubject = this.onClickAddSubject.bind(this);
    this.onChangeFilter = this.onChangeFilter.bind(this);
    this.filterSubject = this.filterSubject.bind(this);
    this.renderSubject = this.renderSubject.bind(this);
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
        count={
          Object.values(this.props.cards.byId).filter(
            card => card.subjectId === subject.id
          ).length || subject.cardCount
        }
        dispatch={this.props.dispatch}
      />
    );
  }

  render() {
    return (
      <div className={styles.subjectsList}>
        <div className={styles.controls}>
          <Button
            onClick={this.onClickAddSubject}
            primary
            disabled={this.props.subjects.requesting}
          >
            Add Subject
          </Button>
        </div>
        <FilterBox
          value={this.state.filter}
          onChange={this.onChangeFilter}
          totalCount={this.props.subjects.allIds.length}
          filteredCount={
            Object.values(this.props.subjects.byId).filter(this.filterSubject)
              .length
          }
          type="subjects"
        />
        <div className={styles.list}>
          {Object.values(this.props.subjects.byId)
            .filter(this.filterSubject)
            .map(this.renderSubject)}
        </div>
      </div>
    );
  }
}

SubjectsList.propTypes = {
  subjects: SUBJECTS_PROPTYPE,
  cards: CARDS_PROPTYPE,
  activeId: PropTypes.string,
  dispatch: PropTypes.func.isRequired
};

export default connect(SubjectsList.mapStateToProps)(SubjectsList);

import React, { PureComponent } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { values, keys } from "lodash";

import FilterBox from "client/components/filter-box/filter-box";
import Button from "client/components/button/button";
import Subheader from "client/components/subheader/subheader";
import SubjectCard from "client/components/subject-card/subject-card";
import { getSubjects, addSubject } from "client/state/actions/subjects";

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
    if (!this.props.subjects.requesting) {
      this.props.dispatch(getSubjects());
    }
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
    if (keys(this.props.subjects.byId).length > 0) {
      const filteredSubjects = values(this.props.subjects.byId).filter(
        this.filterSubjectBySearchTerm
      );
      return (
        <FilterBox
          onChange={this.onChangeFilter}
          value={this.state.filter}
          type="subjects"
          totalCount={keys(this.props.subjects.byId).length}
          filteredCount={filteredSubjects.length}
        />
      );
    } else {
      return null;
    }
  }

  renderSubjects() {
    return values(this.props.subjects.byId)
      .filter(this.filterSubjectBySearchTerm)
      .map(subject => (
        <SubjectCard
          key={subject.id}
          subject={subject}
          showDialog={this.props.showDialog}
          hideDialog={this.props.hideDialog}
        />
      ));
  }

  getSubjectCount() {
    if (this.props.subjects.requesting) {
      return "...";
    } else {
      return this.props.subjects.allIds.length;
    }
  }

  render() {
    return (
      <div className={styles.subjects}>
        <div className={styles.subheader}>
          <Subheader label="Subjects" />
          <div className={styles.controls}>
            {this.renderFilters()}
            <Button
              primary
              onClick={this.onClickAddSubject}
              disabled={this.props.subjects.requesting}
            >
              Add Subject
            </Button>
          </div>
        </div>
        <div className={styles.subjectList}>{this.renderSubjects()}</div>
      </div>
    );
  }
}

Subjects.propTypes = {
  dispatch: PropTypes.func,
  subjects: SUBJECTS_PROPTYPE,
  showDialog: PropTypes.func,
  hideDialog: PropTypes.func
};

export default connect(Subjects.mapStateToProps)(Subjects);

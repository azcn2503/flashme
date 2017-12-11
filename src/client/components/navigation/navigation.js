import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Link } from 'react-router-dom';

import SubjectsList from '../subjects-list/subjects-list';

import styles from './navigation.scss';

class Navigation extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.navigation}>
        <div className={styles.header}>Cards</div>
        <Link className={styles.navItem} to="/cards">
          All Cards ({this.props.cards.length})
        </Link>
        <div className={styles.header}>Subjects ({this.props.subjects.length})</div>
        <SubjectsList
          cards={this.props.cards}
          subjects={this.props.subjects}
          activeId={this.props.routerProps.match.params.id}
          addSubject={this.props.addSubject}
          removeSubject={this.props.removeSubject}
          updateSubject={this.props.updateSubject}
        />
      </div>
    );
  }
}

Navigation.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.object),
  subjects: PropTypes.arrayOf(PropTypes.object),
  addSubject: PropTypes.func,
  removeSubject: PropTypes.func,
  updateSubject: PropTypes.func,
  routerProps: PropTypes.object
};

export default Navigation;

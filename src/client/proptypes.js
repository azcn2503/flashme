import PropTypes from "prop-types";

export const CARDS_PROPTYPE = PropTypes.shape({
  byId: PropTypes.object.isRequired,
  allIds: PropTypes.arrayOf(PropTypes.string).isRequired
});

export const SUBJECTS_PROPTYPE = PropTypes.shape({
  byId: PropTypes.object.isRequired,
  allIds: PropTypes.arrayOf(PropTypes.string).isRequired
});

export const TESTS_PROPTYPE = PropTypes.shape({
  byId: PropTypes.object.isRequired,
  allIds: PropTypes.arrayOf(PropTypes.string).isRequired
});

export const CARD_PROPTYPE = PropTypes.shape({
  id: PropTypes.string,
  question: PropTypes.string,
  answer: PropTypes.string
});

export const SUBJECT_PROPTYPE = PropTypes.shape({
  id: PropTypes.string,
  title: PropTypes.string
});

export const USER_PROPTYPE = PropTypes.shape({
  loggedIn: PropTypes.bool,
  currentUser: PropTypes.shape({
    id: PropTypes.string,
    username: PropTypes.string
  })
});

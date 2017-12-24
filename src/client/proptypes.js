import PropTypes from "prop-types";

export const CARDS_PROPTYPE = PropTypes.shape({
  byId: PropTypes.object,
  allIds: PropTypes.arrayOf(PropTypes.string)
});

export const SUBJECTS_PROPTYPE = PropTypes.shape({
  byId: PropTypes.object,
  allIds: PropTypes.arrayOf(PropTypes.string)
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

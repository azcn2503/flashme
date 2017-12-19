import uuidv4 from "uuid/v4";

export const addTest = (subjectId, cards) =>
  Promise.resolve({
    id: uuidv4(),
    subjectId,
    cards
  });


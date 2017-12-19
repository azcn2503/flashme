import uuidv4 from "uuid/v4";

export const createTest = (subjectId, cards) =>
  Promise.resolve({
    id: uuidv4(),
    subjectId,
    cards
  });


import uuidv4 from "uuid/v4";
import Promise from "bluebird";

export const createCard = (subjectId, card) =>
  Promise.resolve({
    id: uuidv4(),
    created: Date.now(),
    subjectIds: [subjectId],
    ...card
  });

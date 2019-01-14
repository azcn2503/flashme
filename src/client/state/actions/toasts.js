export const ADD_TOAST = "ADD_TOAST";
export const CLOSE_TOAST = "CLOSE_TOAST";

export const addToast = message => ({
  type: ADD_TOAST,
  message
});

export const closeToast = id => ({
  type: CLOSE_TOAST,
  id
});

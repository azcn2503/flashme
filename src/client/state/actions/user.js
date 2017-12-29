import * as api from "client/api/user";

export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";

export const REGISTER_REQUEST = "REGISTER_REQUEST";
export const REGISTER_SUCCESS = "REGISTER_SUCCESS";
export const REGISTER_FAILURE = "REGISTER_FAILURE";

export const login = (username, password) => dispatch => {
  dispatch({ type: LOGIN_REQUEST });
  return api
    .login(username, password)
    .then(user => dispatch({ type: LOGIN_SUCCESS, user }))
    .catch(err => dispatch({ type: LOGIN_FAILURE, err }));
};

export const register = (username, password, email) => dispatch => {
  dispatch({ type: REGISTER_REQUEST });
  return api
    .register(username, password, email)
    .then(user => dispatch({ type: REGISTER_SUCCESS, user }))
    .catch(err => dispatch({ type: REGISTER_FAILURE, err }));
};

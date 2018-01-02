import Promise from "bluebird";

import * as api from "client/api/user";

export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";

export const LOGOUT_REQUEST = "LOGOUT_REQUEST";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const LOGOUT_FAILURE = "LOGOUT_FAILURE";

export const REGISTER_REQUEST = "REGISTER_REQUEST";
export const REGISTER_SUCCESS = "REGISTER_SUCCESS";
export const REGISTER_FAILURE = "REGISTER_FAILURE";

export const GET_CURRENT_USER_REQUEST = "GET_CURRENT_USER_REQUEST";
export const GET_CURRENT_USER_SUCCESS = "GET_CURRENT_USER_SUCCESS";
export const GET_CURRENT_USER_FAILURE = "GET_CURRENT_USER_FAILURE";

export const login = (username, password) => dispatch => {
  dispatch({ type: LOGIN_REQUEST });
  return api
    .login(username, password)
    .then(user => dispatch({ type: LOGIN_SUCCESS, user }))
    .catch(err => dispatch({ type: LOGIN_FAILURE, err }));
};

export const logout = () => dispatch => {
  dispatch({ type: LOGOUT_REQUEST });
  return api
    .logout()
    .then(() => dispatch({ type: LOGOUT_SUCCESS }))
    .catch(err => dispatch({ type: LOGOUT_FAILURE, err }));
};

export const register = (username, password, email) => dispatch => {
  dispatch({ type: REGISTER_REQUEST });
  return api
    .register(username, password, email)
    .then(user => {
      dispatch({ type: REGISTER_SUCCESS, user });
      return Promise.resolve(user);
    })
    .catch(err => {
      dispatch({ type: REGISTER_FAILURE, err });
      return Promise.reject(err);
    });
};

export const getCurrentUser = () => dispatch => {
  dispatch({ type: GET_CURRENT_USER_REQUEST });
  return api
    .getCurrentUser()
    .then(user => dispatch({ type: GET_CURRENT_USER_SUCCESS, user }))
    .catch(err => dispatch({ type: GET_CURRENT_USER_FAILURE, err }));
};

import {
  SET_USER,
  LOADING_START,
  LOADING_STOP,
  CLEAR_USER,
  SET_CURRENT_CHANNEL,
  SET_PRIVATE_CHANNEL,
} from "./utils/actionTypes";

export const loadingStart = () => {
  return {
    type: LOADING_START,
  };
};

export const loadingStop = () => {
  return {
    type: LOADING_STOP,
  };
};

export const setUser = (user) => (dispatch) => {
  dispatch({
    type: SET_USER,
    payload: user,
  });
};

export const clearUser = () => {
  return {
    type: CLEAR_USER,
  };
};

export const setCurrentChannel = (channel) => {
  return {
    type: SET_CURRENT_CHANNEL,
    payload: channel,
  };
};

export const setPrivateChannel = (isPrivateChannel) => {
  return {
    type: SET_PRIVATE_CHANNEL,
    payload: isPrivateChannel,
  };
};

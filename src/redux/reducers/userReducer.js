import {
  SET_USER,
  LOADING_START,
  LOADING_STOP,
} from "../actions/utils/actionTypes";

const INITIAL_STATE = {
  currentUser: null,
  loading: false,
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, currentUser: action.payload };
    case LOADING_START:
      return { ...state, loading: true };
    case LOADING_STOP:
      return { ...state, loading: false };
    default:
      return state;
  }
};

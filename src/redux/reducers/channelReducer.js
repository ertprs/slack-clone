import { SET_CURRENT_CHANNEL } from "../actions/utils/actionTypes";

const INITIAL_STATE = {
  currentChannel: null,
};
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_CURRENT_CHANNEL:
      return { ...state, currentChannel: action.payload };
    default:
      return state;
  }
};

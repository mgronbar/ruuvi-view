
import {
  FETCH_DATA_START,
  FETCH_DATA_ERROR,
  FETCH_DATA_SUCCESS,
  DATE_CHANGE,
} from '../actions';

const defaultState = {
  data: {},
};

export default (state = defaultState, action) => {
  const { type, data,start,end ,shift} = action;

  if (type === FETCH_DATA_START) {
    return {
      ...state,
      loading: true,
      error: false,
    };
  }

  if (type === FETCH_DATA_ERROR) {
    return {
      ...state,
      loading: false,
      error: true,
    };
  }

  if (type === FETCH_DATA_SUCCESS) {
    return {
      ...state,
      data,
      loading: false,
      error: false,
    };
  }
  if (type === DATE_CHANGE) {
    return {
      ...state,
      start,
      end,
      shift
    };
  }
  return state;
};

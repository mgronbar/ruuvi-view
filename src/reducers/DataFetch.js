
import {
  FETCH_DATA_START,
  FETCH_DATA_ERROR,
  FETCH_DATA_SUCCESS,
} from '../actions';

const defaultState = {
  data: [],
  
};

export default (state = defaultState, action) => {
  const { type, data } = action;

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
  return state;
};

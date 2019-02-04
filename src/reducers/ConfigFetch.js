
import {
  FETCH_CONFIG_START,
  FETCH_CONFIG_ERROR,
  FETCH_CONFIG_SUCCESS,
} from '../actions';

const defaultState = {
  config: [],
};

export default (state = defaultState, action) => {
  const { type, config} = action;
  
  if (type === FETCH_CONFIG_START) {
    return {
      ...state,
      loading: true,
      error: false,
    };
  }

  if (type === FETCH_CONFIG_ERROR) {
    return {
      ...state,
      loading: false,
      error: true,
    };
  }

  if (type === FETCH_CONFIG_SUCCESS) {
    
    return {
      ...state,
      config,
      loading: false,
      error: false,
    };
  }
 
  return state;
};

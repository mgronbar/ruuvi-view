
import {
  FETCH_CONFIG_START,
  FETCH_CONFIG_ERROR,
  FETCH_CONFIG_SUCCESS,
  FETCH_CONFIG_POST_START,
  FETCH_CONFIG_POST_ERROR,
  FETCH_CONFIG_POST_SUCCESS,
} from '../actions';

const defaultState = {
  config: {charts:[],tagids:[]},
};

export default (state = defaultState, action) => {
  const { type, config} = action;
  
  if (type === FETCH_CONFIG_START ||type === FETCH_CONFIG_POST_START) {
    return {
      ...state,
      loading: true,
      error: false,
    };
  }

  if (type === FETCH_CONFIG_ERROR||type === FETCH_CONFIG_POST_ERROR) {
    return {
      ...state,
      loading: false,
      error: true,
    };
  }

  if (type === FETCH_CONFIG_SUCCESS||type === FETCH_CONFIG_POST_SUCCESS) {
    
    return {
      ...state,
      config,
      loading: false,
      error: false,
    };
  }
 
  return state;
};

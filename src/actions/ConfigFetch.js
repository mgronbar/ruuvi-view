// import config from '../actions/config.json';
//console.log(config)
const { REACT_APP_API_KEY, REACT_APP_API_ENPOINT } = process.env;

export const FETCH_CONFIG_START = 'FETCH_CONFIG_START';
export const FETCH_CONFIG_ERROR = 'FETCH_CONFIG_ERROR';
export const FETCH_CONFIG_SUCCESS = 'FETCH_CONFIG_SUCCESS';
export const FETCH_CONFIG_POST_START = 'FETCH_CONFIG_POST_START';
export const FETCH_CONFIG_POST_ERROR = 'FETCH_CONFIG_POST_ERROR';
export const FETCH_CONFIG_POST_SUCCESS = 'FETCH_CONFIG_POST_SUCCESS';

const fetchStart = ({ type }) => ({
  type,
});

const fetchError = ({ type, error }) => ({
  type,
  error,
});

const fetchSuccess = ({ type, config }) => ({
  type,
  config,
});


export const fetchConfigPost = (config) => async (
  dispatch,
  getState,
  
) => {
  dispatch(fetchStart({ type: FETCH_CONFIG_POST_START }));
  try {
    await fetch(
       `${REACT_APP_API_ENPOINT}/config`,
       {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": `${REACT_APP_API_KEY}`
        },
        body: JSON.stringify(config)
      }
    ).then(response => {
      
      return response.json()})
    // .then(data => sortData(data))
    .then(config => dispatch(fetchSuccess({ type: FETCH_CONFIG_POST_SUCCESS, config })))
    .catch(error => dispatch(fetchError({type: FETCH_CONFIG_POST_ERROR, error})));
    
  } catch (error) {
    
    return dispatch(
      fetchError({ type: FETCH_CONFIG_POST_ERROR, error: error.message }),
    );
  }
};

export const fetchConfig = ({ location }) => async (
  dispatch,
  getState,
  
) => {
  dispatch(fetchStart({ type: FETCH_CONFIG_START }));
  try {
    const config = await fetch(
       `${REACT_APP_API_ENPOINT}/config?address=${location}`,
       {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": `${REACT_APP_API_KEY}`
        } 
      }
    ).then(response => {
      
      return response.json()})
    // .then(data => sortData(data))
    .then(config => dispatch(fetchSuccess({ type: FETCH_CONFIG_SUCCESS, config })))
    .catch(error => dispatch(fetchError({type: FETCH_CONFIG_ERROR, error})));
    
  } catch (error) {
    
    return dispatch(
      fetchError({ type: FETCH_CONFIG_ERROR, error: error.message }),
    );
  }
};
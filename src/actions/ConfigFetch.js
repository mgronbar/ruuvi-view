import config from '../actions/config.json';
console.log(config)
const { REACT_APP_API_KEY, REACT_APP_API_ENPOINT } = process.env;

export const FETCH_CONFIG_START = 'FETCH_CONFIG_START';
export const FETCH_CONFIG_ERROR = 'FETCH_CONFIG_ERROR';
export const FETCH_CONFIG_SUCCESS = 'FETCH_CONFIG_SUCCESS';

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



export const fetchConfig = ({ location }) => async (
  dispatch,
  getState,
  
) => {
  dispatch(fetchStart({ type: FETCH_CONFIG_START }));
  try {
    // const data = await fetch(
    //   `${REACT_APP_API_ENPOINT}?address=${address}&start=${start}&end=${end}`,
    //   {
    //     headers: {
    //       "Content-Type": "application/json",
    //       "x-api-key": `${REACT_APP_API_KEY}`
    //     } 
    //   }
    // ).then(response => response.json())
    // .then(data => sortData(data))
    // .then(data => dispatch(fetchSuccess({ type: FETCH_CONFIG_SUCCESS, data })))
    // .catch(error => dispatch(fetchError({type: FETCH_CONFIG_ERROR, error})));
    
    dispatch(
      fetchSuccess(
        {type:FETCH_CONFIG_SUCCESS, 
          config:config[location]
        }))
  } catch (error) {
    
    return dispatch(
      fetchError({ type: FETCH_CONFIG_ERROR, error: error.message }),
    );
  }
};
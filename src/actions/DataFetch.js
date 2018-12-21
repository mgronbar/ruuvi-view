const { REACT_APP_API_KEY, REACT_APP_API_ENPOINT } = process.env;

export const FETCH_DATA_START = 'FETCH_DATA_START';
export const FETCH_DATA_ERROR = 'FETCH_DATA_ERROR';
export const FETCH_DATA_SUCCESS = 'FETCH_DATA_SUCCESS';

export const DATE_CHANGE = 'DATE_CHANGE';

const fetchStart = ({ type }) => ({
  type,
});

const fetchError = ({ type, error }) => ({
  type,
  error,
});

const fetchSuccess = ({ type, data }) => ({
  type,
  data,
});
const sortData = data => {
  const d = data.reduce((a, { tagid, created, payload }) => {
    const std =
      (payload.accelerationXstd +
        payload.accelerationYstd +
        payload.accelerationZstd) /
      3;

    a[tagid] = a[tagid] || [];
    const i = a[tagid].length;
    a[tagid] = [
      ...a[tagid],
      {
        time: created,
        payload: {
          ...payload,
          pressure: payload.pressure / 100,
          accelerationStd: std,
          accelerationStdAvg:
            Math.round(
              (100 *
                (std +
                  (i > 0 ? a[tagid][i - 1].payload.accelerationStd : std) +
                  (i > 1 ? a[tagid][i - 1].payload.accelerationStd : std))) /
                3
            ) / 100
        }
      }
    ];
    return a;
  }, {});
  return d;
};

export const dateChange = ({start, end}) => ({
  type: DATE_CHANGE,
  start,
  end,
});

export const fetchData = ({ address, start, end }) => async (
  dispatch,
  getState,
  
) => {
  dispatch(fetchStart({ type: FETCH_DATA_START }));
  try {
    const data = await fetch(
      `${REACT_APP_API_ENPOINT}?address=${address}&start=${start}&end=${end}`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": `${REACT_APP_API_KEY}`
        } 
      }
    ).then(response => response.json())
    .then(data => sortData(data))
    .then(data => dispatch(fetchSuccess({ type: FETCH_DATA_SUCCESS, data })))
    .catch(error => dispatch(fetchError({type: FETCH_DATA_ERROR, error})));
  } catch (error) {
    
    return dispatch(
      fetchError({ type: FETCH_DATA_ERROR, error: error.message }),
    );
  }
};
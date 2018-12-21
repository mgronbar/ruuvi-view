import Moment from 'moment';
import { extendMoment } from 'moment-range';
import { findNearest } from 'geolib';
import observationStations from '../../constants/observation-stations';

const moment = extendMoment(Moment);

export const FETCH_CONFIGS_START = 'FETCH_CONFIGS_START';
export const FETCH_CONFIGS_ERROR = 'FETCH_CONFIGS_ERROR';
export const FETCH_CONFIGS_SUCCESS = 'FETCH_CONFIGS_SUCCESS';

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



export const fetchConfig = ({ dateRange, deviceIds, latLng }) => async (
  dispatch,
  getState,
  
) => {
  
  dispatch(fetchStart({ type: FETCH_CONFIGS_START }));
  try {
    const endpoint = `${
      process.env.REACT_APP_CONFIGS_ENDPOINT
    }/chart/${deviceIds}?startDate=${startDateString}&endDate=${endDateString}&groupBy=${groupBy}&observationStation=${observationStation}`;
    const data = await fetch(endpoint).then(res => res.json());
    return dispatch(fetchSuccess({ type: FETCH_CONFIGS_SUCCESS, data }));
  } catch (error) {
    
    return dispatch(
      fetchError({ type: FETCH_CONFIGS_ERROR, error: error.message }),
    );
  }
};


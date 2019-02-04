import { combineReducers } from 'redux'
import DataFetch from './DataFetch';
import ConfigFetch from './ConfigFetch';

export default combineReducers({
  DataFetch, ConfigFetch
})
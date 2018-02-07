import { combineReducers } from 'redux';

import dataService, { INITIAL_STATE as DS_INITIAL_STATE } from './data-service';
import fields, { INITIAL_STATE as FIELDS_INITIAL_STATE } from './fields';
import namespace, { INITIAL_STATE as NS_INITIAL_STATE, NAMESPACE_CHANGED } from './namespace';
import serverVersion, { INITIAL_STATE as SV_INITIAL_STATE } from './server-version';
import stages, { INITIAL_STATE as STAGE_INITIAL_STATE } from './stages';
import view, { INITIAL_STATE as VIEW_INITIAL_STATE } from './view';

/**
 * The intial state of the root reducer.
 */
export const INITIAL_STATE = {
  dataService: DS_INITIAL_STATE,
  fields: FIELDS_INITIAL_STATE,
  namespace: NS_INITIAL_STATE,
  serverVersion: SV_INITIAL_STATE,
  stages: STAGE_INITIAL_STATE,
  view: VIEW_INITIAL_STATE
};

/**
 * Reset action constant.
 */
export const RESET = 'aggregations/reset';

/**
 * The main application reducer.
 *
 * @returns {Function} The reducer function.
 */
const appReducer = combineReducers({
  dataService,
  fields,
  namespace,
  serverVersion,
  stages,
  view
});

/**
 * The root reducer.
 *
 * @param {Object} state - The state.
 * @param {Object} action - The action.
 *
 * @note Handle actions that need to operate
 *  on more than one area of the state here.
 *
 * @returns {Function} The reducer.
 */
const rootReducer = (state, action) => {
  switch (action.type) {
    case NAMESPACE_CHANGED:
      return appReducer(INITIAL_STATE, action);
    case RESET:
      return { ...INITIAL_STATE };
    default:
      return appReducer(state, action);
  }
};

export default rootReducer;

/**
 * Reset the entire state.
 *
 * @returns {Object} The action.
 */
export const reset = () => ({
  type: RESET
});

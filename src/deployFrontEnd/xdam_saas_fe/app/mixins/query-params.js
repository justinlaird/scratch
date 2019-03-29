import QueryParams from 'ember-parachute';
import { serialize, deserialize } from 'xdam-saas-fe/utils/query-params';

export const mainQueryParams = new QueryParams({
  project: {
    defaultValue: '',
    refresh: true,
  },
  leftRailTab: {
    defaultValue: 'project',
    serialize,
    deserialize,
  },
  rightRailTab: {
    defaultValue: 'info',
    serialize,
    deserialize,
  },
  leftRail: {
    defaultValue: true,
  },
  rightRail: {
    defaultValue: true,
  },
}).Mixin;

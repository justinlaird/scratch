export const FilterOps = {
  gt: '>',
  lt: '<',
  in: ':',
  or: 'OR',
  and: 'AND',
  bool: 'filterBooleans',
};

export function applyFilter(list, filter){
  if (filter) {
    Object.keys(filter).forEach(filterProp => {
      if (FilterOps.bool === filterProp) {
        return;
      }
      list = applyFilterToProperty(list, filter, filterProp);
    });
  }
  return list;
}

export function applyFilterToProperty(list, filter, filterProp) {
  if ( Array.isArray(filter[filterProp]) ) {
    filter[filterProp].forEach(filterItem => {
      list = applyFilterValToProperty(list, filterProp, filterItem);
    });
    return list;
  } else {
    return applyFilterValToProperty(list, filterProp, filter[filterProp]);
  }
}

export function applyFilterValToProperty(list, filterProp, filterItem)
{
  const filterVal = filterItem.slice(1);
  const filterOperator = filterItem.slice(0,1);
  if (FilterOps.lt === filterOperator || FilterOps.gt === filterOperator){
    return list.filter(record => {
      if (filterOperator === FilterOps.lt) {
        return record[filterProp] < filterVal;
      } else if (filterOperator === FilterOps.gt) {
        return record[filterProp] > filterVal;
      }
    });
  } else {
    return list.filter(record => record[filterProp].includes(filterVal));
  }
}

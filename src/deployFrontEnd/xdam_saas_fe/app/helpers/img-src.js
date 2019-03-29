import { helper } from '@ember/component/helper';
import { getProperties }  from '@ember/object';
import constants from 'xdam-saas-fe/utils/constants';

export function imgSrc([model], { size }) {

  if (model == null) { // eslint-disable-line
    throw Error(`Missing model positional param. Usage: {{img-src <model> size=${constants.SIZE_OPTIONS}}}`);
  }

  const hasSrc = model.location != null || model.url != null;  // eslint-disable-line

  if (!hasSrc) { // eslint-disable-line
    throw Error(`Missing model.location or model.src. Usage: {{img-src <model> size=${constants.SIZE_OPTIONS}}}`);
  }

  if (model.name == null) { // eslint-disable-line
    throw Error('Missing model.name');
  }

  if (size == null || !constants.SIZES.includes(size)) { // eslint-disable-line
    throw Error(`Missing named param "size". Usage: {{img-src <model> size=${constants.SIZE_OPTIONS}}}`);
  }

  const {
    location,
    name,
    id,
    success,
    url,
  } = getProperties(model, 'location', 'name', 'id', 'success', 'url');

  if (url) {
    return url;
  } else if (success === false && !id) { // for demo cards only atm
    return `https://${location}/${size}/${name}`;
  } else if (success === false && id) { // DEPRECATED: for images in the old aws account
    if (size === 'mini') { size = 'xsmall'; } // sls has constants map where mini represents the smallest size, so rename old aws bucket path for that size, mini -> xsmall
    return `//${location}/${size}/${name}`;
  }

  // DEFAULT:
  // SLS will save db record with success: true, and will place the image
  // under a bucket path that nests under the :assetId/:size/:name
  return `https://${location}/${id}/${size}/${name}`;
}

export default helper(imgSrc);

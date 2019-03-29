export default {
  data(list=[]) {
    if (list.length === 0) { throw Error('Must pass list to playground#data'); }
    return list.map((name) => {
      return {
        name: `${name}.jpeg`,
        location: `d1f2eqtpkzqep3.cloudfront.net`,
        success: false,
      };
    });
  },

  generate({ count = 0, shuffle = true, slice = 0 } = {}) {
    console.log("playground - count: %o, shuffle: %o, slice: %o", count, shuffle, slice); // eslint-disable-line no-console

    const result = [];
    while(count > 0) {
      if (shuffle) {
        result.push(...this._shuffle(this._names));
      } else {
        result.push(...this._names);
      }
      count -= 1;
    }

    if (slice !== 0) {
      if (slice % 2 !== 0) { throw Error('Must have pass even number as slice'); }
      return result.slice(0, slice);
    } else {
      return result;
    }
  },

  _randomInt(min=0, max=min) {
    if (max - min < 0) { throw Error('max - min must be greater than 0'); }
    if (!Number.isInteger(min) || !Number.isInteger(max)) { throw Error('Must pass integers'); }
    if (min < 0 || max < 0) { throw Error('max and min must be positive integers'); }
    return Math.floor(Math.random() * (max - min + 1) + min);
  },

  _shuffle(input=[]) {
    const n = input.length - 1;
    for (const index of input.keys()) {
      const randomIndex = this._randomInt(index, n);
      [input[index], input[randomIndex]] = [input[randomIndex], input[index]];
    }
    return input;
  },

  _names: 'a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z'.split(','),
};

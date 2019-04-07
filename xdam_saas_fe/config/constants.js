const COMPRESSION_EXTENSIONS = [
  'js',
  'css',
  'json',
  'ico',
  'map',
  'xml',
  'txt',
  'eot',
  'ttf',
  'woff',
  'woff2',
  'svg',
  'wasm',
  'webmanifest',
];

const FINGERPRINT_EXTENSIONS = COMPRESSION_EXTENSIONS.concat([
  'jpg',
  'jpeg',
  'png',
  'gif',
]);

const COMPRESSION_FILE_PATTERN = `**/*.{${COMPRESSION_EXTENSIONS.join(',')}}`;
const FINGERPRINT_FILE_PATTERN = `**/*.{${FINGERPRINT_EXTENSIONS.join(',')}}`;

module.exports = {
  COMPRESSION_EXTENSIONS,
  COMPRESSION_FILE_PATTERN,
  FINGERPRINT_EXTENSIONS,
  FINGERPRINT_FILE_PATTERN,
};

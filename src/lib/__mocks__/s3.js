'use strict';

import fs from 'fs-extra';

const upload = (path) => {
  return fs.remove(path)
    .then(() => {
      return Promise.resolve('https://mockimagepath.com');
    });
};

const remove = () => {
  return Promise.resolve('delete complete');
};
export default { upload, remove };
'use strict';

const upload = () => {
  return Promise.resolve('https://mockimagepath.com');
};

const remove = () => {
  return Promise.resolve('delete complete')
}
export default {upload, remove};
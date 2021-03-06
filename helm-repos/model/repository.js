const knex = require('../db');
const errors = require('../utils/errors');

async function create(payload) {
  const { url, name } = payload.body;
  const dbObj = await knex('helm_repos')
    .insert({ url, name })
    .returning('*')
    .catch((err) => {
      if (err.code === '23505') {
        const collumn = err.detail.match(/\((.*?)\)/g)[0].replace('(', '').replace(')', '');
        throw new errors.UniqueConstraintValidationError(`Duplicate entry for ${collumn}`);
      } else {
        throw err;
      }
    });
  return dbObj[0];
}
async function get(repoId) {
  const dbObj = await knex('helm_repos')
    .select()
    .where({ id: repoId })
    .first()
    .catch((err) => {
      console.log(err)
    });
  if (dbObj === undefined) {
    throw new errors.HelmRepoNotFound(`Helm reposistory ${repoId} not found`);
  }
  return dbObj;
}

async function list() {
  const arr = await knex('helm_repos')
    .select();
  return arr;
}

module.exports = {
  get,
  create,
  list,
};

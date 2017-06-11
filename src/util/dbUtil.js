const Promise = require('promise'),
    promiseOptions = {
        // Initialization Options
        promiseLib: Promise
    },
    pgConn = {
        host: '127.0.0.1',
        port: 5432,
        database: 'ut',
        user: 'postgres',
        password: '4nubis!',
        poolSize: 30
    },
    pgp = require('pg-promise')(promiseOptions),
    db = pgp(pgConn);
module.exports = db;
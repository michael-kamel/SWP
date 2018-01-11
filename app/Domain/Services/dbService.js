ioc.registerModule('dbService', function (logger) 
{
    const bluebird = require('bluebird')
    const ExpressCassandra = require('express-cassandra')
    let models = ExpressCassandra.createClient(
    {
        clientOptions: 
        {
            contactPoints: [process.env.DB_IP1],
            protocolOptions: { port: process.env.DB_PORT },
            keyspace: process.env.DB_NAME,
            queryOptions: {consistency: ExpressCassandra.consistencies.one},
            promiseFactory: bluebird.fromCallback
        },
        ormOptions: 
        {
            defaultReplicationStrategy : 
            {
                class: process.env.CASSANDRA_REPLICATION_STRATEGY,// NetworkTopologyStrategy, SimpleStrategy
                replication_factor: process.env.CASSANDRA_REPLICATION_FACTOR
            },
            migration: 'safe',
        }
    });
    
    return models
})
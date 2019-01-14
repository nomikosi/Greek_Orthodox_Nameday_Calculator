
function initializeSettings() {
    var settings = {
        loginCollection: 'authentication',
        nameDayCollection: 'namedays',
        databasePath: 'mongodb://127.0.0.1:27017/local',
        findbydatePath: '/findbydate/',
        findbynamePath: '/findbyname/',
        databaseEngine: require('mongodb').MongoClient,
        authenticate: 'WWW-Authenticate',
        realm: 'Basic realm=CelebrationServiceRealm',
    };
    return settings;
}

exports.initializeSettings = initializeSettings;
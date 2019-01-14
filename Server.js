//////////////////////////////////////////////////////////
// Modules declaration ///////////////////////////////////
//////////////////////////////////////////////////////////
var express = require('express');
var basicAuth = require('basic-auth');
//var MongoClient = require('mongodb').MongoClient;


var url = require('url');
var calen = require('./CalculateOrthodoxEaster.js');
var importSettings = require('./InitializeSettings.js');
//////////////////////////////////////////////////////////
// Global scoped vars  ///////////////////////////////////
//////////////////////////////////////////////////////////
var app = express();
var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
var today = new Date();
var defaultSettings = importSettings.initializeSettings();


app.use((function (req, res, next) {

    var credentials = basicAuth(req);
    defaultSettings.databaseEngine.connect(defaultSettings.databasePath, function (err, db) {
        if (err) {
            throw err;
        }

        res.setHeader(defaultSettings.authenticate, defaultSettings.realm);

        if (typeof credentials === 'undefined')
        {
            return res.status(401).send();
        }

        var collection = db.collection(defaultSettings.loginCollection);
        collection.find({"username": credentials.name, "password": credentials.pass}).toArray(function (err, user) {
            if (user.length < 1) {
                return res.status(401).send();
            }
            return next();
        });
    });
}));


app.get(defaultSettings.findbydatePath, function (req, res) {

    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;

    if (!query.hasOwnProperty('year')) {
        res.status(400).send('you must provide year');
        return next();
    }

    if (!query.hasOwnProperty('month')) {
        res.status(400).send('you must provide month');
        return next();
    }

    if (!query.hasOwnProperty('day')) {
        res.status(400).send('you must provide day');
        return next();
    }

    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;

    var inputDate = new Date(query.year, query.month - 1, query.day, 0, 0, 0, 0);
    var orthodoxEasterDate = calen.orthodoxEasterFunct(query.year);

    //convert to UTC to find correct day difference
    var inputDateUTC = Date.UTC(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate());
    var orthodoxEasterDateUTC = Date.UTC(orthodoxEasterDate.getFullYear(), orthodoxEasterDate.getMonth(), orthodoxEasterDate.getDate());
    //find difference in days
    var diffDays = (inputDateUTC - orthodoxEasterDateUTC) / (oneDay);
    var resultList = [];

    defaultSettings.databaseEngine.connect(defaultSettings.databasePath, function (err, db) {
        if (err) {
            throw err;
        }

        var collection = db.collection(defaultSettings.nameDayCollection);
        collection.find({"CelebrationMonth": query.month, "CelebrationDay": query.day, "IsEasterRelated": "0", "IsStatic": "1"}).toArray(function (err, staticDocs) {

            for (var i = 0; i < staticDocs.length; i++) {
                resultList.push(getCelebrationNameDTO(staticDocs[i]));
            }

            collection.find({"Difference": diffDays.toString(), "IsEasterRelated": "0", "IsStatic": "0"}).toArray(function (err, dynamicDocs) {

                for (var j = 0; j < dynamicDocs.length; j++) {
                    resultList.push(getCelebrationNameDTO(dynamicDocs[j]));
                }
                collection.find({"IsEasterRelated": '1'}).toArray(function (err, relatedDocs) {

                    var StGeorgeDate = new Date(query.year, relatedDocs[0].CelebrationMonth - 1, relatedDocs[0].CelebrationDay, 0, 0, 0, 0);
                    var StGeorgeDateUTC = Date.UTC(StGeorgeDate.getFullYear(), StGeorgeDate.getMonth(), StGeorgeDate.getDate());

                    if ((orthodoxEasterDateUTC > StGeorgeDateUTC) && diffDays === 1)
                    {
                        resultList.push(getCelebrationNameDTO(relatedDocs[0]));
                    }

                    if ((orthodoxEasterDateUTC < StGeorgeDateUTC) && (relatedDocs[0].CelebrationMonth === query.month) && relatedDocs[0].CelebrationDay === query.day)
                    {
                        resultList.push(getCelebrationNameDTO(relatedDocs[0]));
                    }
                    //convert json array to json object
                    var i = {};
                    i.nameDays = resultList;
                    res.send(i);
                });
            });
        });
    });
});


app.get(defaultSettings.findbynamePath, function (req, res, next) {

    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;

    if (!query.hasOwnProperty('name')) {
        res.status(400).send('you must provide name');
        return next();
    }

    defaultSettings.databaseEngine.connect(defaultSettings.databasePath, function (err, db) {
        if (err) {
            throw err;
        }

        var collection = db.collection(defaultSettings.nameDayCollection);
        collection.find({"CelebrationNames": query.name}).toArray(function (err, nameDocs) {
            //convert json array to json object
            var i = {};
            i.nameDayDates = returnDates(nameDocs);
            res.send(JSON.stringify(i));
        });
    });
});
app.listen(3000);


function returnDates(jsonList) {

    var orthodoxEasterDate = calen.orthodoxEasterFunct(today.getFullYear());
    var orthodoxEasterDateUTC = Date.UTC(orthodoxEasterDate.getFullYear(), orthodoxEasterDate.getMonth(), orthodoxEasterDate.getDate());
    var dateList = [];

    for (var i = 0; i < jsonList.length; i++) {

        var namesDayDate = new Date(today.getFullYear(), jsonList[i].CelebrationMonth - 1, jsonList[i].CelebrationDay, 0, 0, 0, 0);
        var namesDayDateUTC = Date.UTC(today.getFullYear(), jsonList[i].CelebrationMonth - 1, jsonList[i].CelebrationDay, 0, 0, 0, 0);

        //St. George case
        if (jsonList[i].IsEasterRelated === '1') {

            var StGeorgeDateUTC = Date.UTC(namesDayDate.getFullYear(), namesDayDate.getMonth(), namesDayDate.getDate());

            if ((orthodoxEasterDateUTC > StGeorgeDateUTC))
            {
                dateList.push(new Date(oneDay + orthodoxEasterDateUTC));
            }

            if ((orthodoxEasterDateUTC < StGeorgeDateUTC))
            {
                dateList.push(new Date(StGeorgeDateUTC));
            }
        }

        //Dynamic namedays
        if ((jsonList[i].IsStatic === '0') && (jsonList[i].IsEasterRelated === '0')) {
            dateList.push(new Date(jsonList[i].Difference * oneDay + orthodoxEasterDateUTC));

        }

        //Static namedays
        if ((jsonList[i].IsStatic === '1') && (jsonList[i].IsEasterRelated === '0')) {
            dateList.push(new Date(namesDayDateUTC));
        }

    }
    return dateList;
}


// This function converts the Mongo json document to the returned DTO of findbydate
function getCelebrationNameDTO(record) {

    var map = {};
    map.celebrationNames = record.CelebrationNames;
    map.celebrationDay = record.CelebrationDay;
    map.celebrationMonth = record.CelebrationMonth;
    map.difference = record.Difference;
    map.isEasterRelated = record.IsEasterRelated;
    map.isStatic = record.IsStatic;

    var x = JSON.stringify(map);
    return JSON.parse(x);
}
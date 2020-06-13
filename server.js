var express = require('express');
var cors = require('cors');
var mongo = require('mongodb');
var bodyParser = require('body-parser');

var app = express();
app.use(cors());
app.use(bodyParser.json())

var url = "mongodb://127.0.0.1:27017/titans_db";
var connectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

var resultss = {};
var u = {

};
app.get('/todo/username', (req, res) => {
    var responseString = JSON.stringify(u);
    res.send(responseString);
    res.end();
});




mongo.MongoClient.connect(url, connectionOptions, (err, client) => {
    if (err) {
        console.log("cannot connect to mongodb server");
        return;
    }

    console.log("connected successfully to mongodb");

    // ============================================================================================

    var titansDb = client.db("titans_db");

    app.post('/todo/login', (req, res) => {
        titansDb.collection("authentication").findOne(req.body, (err, result) => {
            if (err) {
                res.status(500).send();
                return;
            }
            if (result != undefined) {
                res.status(200).send(result);
                u.Username = result.Username;
            } else {
                res.status(401).send();
            }

        })

    })
    app.post('/todo/signin', (req, res) => {
        titansDb.collection("authentication").findOne(req.body, (err, result) => {
            var i = { "good": 0 }
            if (err) {
                res.status(500).send();
                return;
            }
            if (result != undefined) {
                res.status(200).send(result);
            } else {
                res.status(200).send(i);
            }

        })

    })


    app.post('/todo/list', (req, res) => {
        titansDb.collection("todoItems").findOne(req.body, (err, result) => {
            if (err) {
                res.status(500).send();
                return;
            }
            res.status(200).send(result);
            resultss = result;

        })
    })

    app.post('/todo/updatelist', (req, res) => {

        titansDb.collection("todoItems").updateOne(resultss, req.body, (err, result) => {
            if (err) {
                res.status(500).send();
                return;
            }
            res.status(200).send(result);

        })
    })



    app.get('/todo/filter', (req, res) => {


        var filterObject = {
            Username: u.Username,
            isCompleted: false
        };

        titansDb
            .collection("todoItems")
            .find(filterObject)
            .toArray()
            .then(result => {
                res.status(200).send(result);
            })
            .catch(error => {
                console.log(error);
                res.status(500).send();
            })
    })


    app.get('/todo/filter/true', (req, res) => {


        var filterObject = {
            Username: u.Username,
            isCompleted: true
        };

        titansDb
            .collection("todoItems")
            .find(filterObject)
            .toArray()
            .then(result => {
                res.status(200).send(result);
            })
            .catch(error => {
                console.log(error);
                res.status(500).send();
            })
    })

    app.post('/todo/delete', (req, res) => {
        titansDb.collection("todoItems").deleteOne(req.body, (err) => {
            if (err) {
                res.status(500).send();
                return;
            }
            res.status(200).send();
        })
    })


    app.post('/todo/update', (req, res) => {
        var newa = { $set: { "isCompleted": true } };
        titansDb.collection("todoItems").updateOne(req.body, newa, (err) => {
            if (err) {
                res.status(500).send();
                return;
            }
            res.status(200).send();
        })
    })

    app.post('/todo/create', (req, res) => {
        titansDb.collection("todoItems").insertOne(req.body, (err, result) => {
            if (err) {
                res.status(500).send();
                return;
            }
            res.status(201).send(result.ops);
        })
    })

    app.post('/todo/create/id', (req, res) => {
        titansDb.collection("authentication").insertOne(req.body, (err, result) => {
            if (err) {
                res.status(500).send();
                return;
            }
            res.status(201).send(result.ops);
        })
    })

    app.listen(8080);
})
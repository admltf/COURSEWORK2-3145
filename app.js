const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require("body-parser")

app.use(cors())
app.use(express.json())

var fs = require('fs')
var path = require('path')

const MongoClient = require('mongodb').MongoClient


let db 
MongoClient.connect('mongodb+srv://admltf:Gunners23!@cluster0.ppm3u.mongodb.net/WEBAPP', 
(err, client) => {
    db = client.db('WEBAPP')
})

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    return next();
});

app.use(function(req, res, next) {
    console.log("Incoming: " + req.method + " to " + req.url)
    return next();
})

app.param('collectionName', (req, res, next, collectionName) => {
    req.collection = db.collection(collectionName)
    return next()
})

//prompt to select collection
app.get('/', (req, res, next) => {
    res.send('Select a collection. e.g., /collection/lessons')
})

//view a specified collection
app.get('/collection/:collectionName', (req, res, next) => {
    req.collection.find({}).toArray((e, results) => {
        if (e) return next(e)
        res.send(results)
    })
})

//add an order to the collection
app.post('/collection/:collectionName', (req, res, next) => {
    req.collection.insertOne(req.body, (e, results) => {
        if (e) return next(e)
        res.send(results.ops)
    })
})

//find object with specified ID
const ObjectID = require('mongodb').ObjectId
app.get('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.findOne({ _id: new ObjectID((req.params.id).trim()) }, (e, result) => {
        if (e) return next (e)
        res.send(result)
    })
})

//update spaces of lessons
app.put('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.updateOne(
        {_id: new ObjectID((req.params.id).trim())},
        {$set: req.body},
        {safe: true, multi: false},
        (e, result) => {
            if (e) return next(e)
            res.send((result.n === 1) ? {msg: 'success'} : {msg: 'error'})
        }
    )
}) 

//delete object from database
app.delete('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.deleteOne(
        {_id: ObjectID(req.params.id)},
        (e, result) => {
            if (e) return next(e)
            res.send((result.n === 1) ? {msg: 'success'} : {msg: 'error'})
        })
})

//check if image exists in static
app.use(function(req, res, next) {
    var filePath = path.join(__dirname, "static", req.url)
    fs.stat(filePath, function (err, fileInfo) {
        if (err) {
            next()
            return 
        }
        if (fileInfo.isFile()) {
            res.sendFile(filePath)
        }
        else {
            next()
        }
    })
})

//error if file is not found
app.use(function(req, res) {
    res.status(404)
    res.send("File not found. Please try again.")
})

const port = process.env.PORT || 3000
app.listen(port, function() {
    console.log("Listening on 3000")
})





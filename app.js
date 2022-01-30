var express = require('express')
var app = express()
var bodyParser = require("body-parser")

app.use(express.json())

const MongoClient = require('mongodb').MongoClient

let db 
MongoClient.connect('mongodb+srv://admltf:Gunners23!@cluster0.ppm3u.mongodb.net/WEBAPP', 
(err, client) => {
    db = client.db('WEBAPP')
})

app.param('collectionName', (req, res, next, collectionName) => {
    req.collection = db.collection(collectionName)
    return next()
})

app.get('/', (req, res, next) => {
    res.send('Select a collection. e.g., /collection/lessons')
})

app.get('/collection/:collectionName', (req, res, next) => {
    req.collection.find({}).toArray((e, results) => {
        if (e) return next(e)
        res.send(results)
    })
})

app.post('/collection/:collectionName', (req, res, next) => {
    req.collection.insertOne(req.body, (e, results) => {
        if (e) return next(e)
        res.send(results.ops)
    })
})

const ObjectID = require('mongodb').ObjectId
app.get('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.findOne({ _id: new ObjectID((req.params.id).trim()) }, (e, result) => {
        if (e) return next (e)
        res.send(result)
    })
})

app.put('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.updateOne(
        {_id: new ObjectID((req.params.id).trim())},
        {$set: req.body},
        {safe: true, multi: false},
        (e, result) => {
            if (e) return next(e)
            res.send(result.result === 1 ? {msg: 'success'} : {msg: 'error'})
        }
    )
}) 

app.delete('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.deleteOne(
        {_id: ObjectID(req.params.id)},
        (e, result) => {
            if (e) return next(e)
            res.send((result.result === 1) ? {msg: 'success'} : {msg: 'error'})
        })
})


app.listen(3000, function() {
    console.log("Listening on 3000")
})





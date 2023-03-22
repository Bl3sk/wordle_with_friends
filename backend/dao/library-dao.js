"use strict";
const DbConnection = require("../db/db-connection");
const ObjectId = require('mongodb').ObjectID;
require("dotenv").config()

// connection string for locally running MongoDB
const connectionString = process.env.MONGO_URI
class LibraryDao {
 // initialize the connection the database and specify the collection name
    constructor() {
        this.wordsCollection = "words"
        this.usersCollection = "users"
        this.avatarsCollection = "avatars"
        DbConnection.init(connectionString);
 }
    async getWords(date) {
        let db = await DbConnection.get(connectionString);
        return await db
            .collection(this.wordsCollection)
            .findOne({ date: date })
    }

    async getUser(filter) {
        console.log(filter)
        let db = await DbConnection.get(connectionString);
        return await db
            .collection(this.usersCollection)
            .findOne(filter)
    }

    async getAvatar(filter) {
        console.log("GET AVATAR", filter)
        let db = await DbConnection.get(connectionString);
        return await db
            .collection(this.avatarsCollection)
            .findOne(filter)
    }

    // returns the first 1000 documents by default
    // filter param allows to filter documents by specific attributes
    // pageInfo allows to specify the page number and page size
    // sort param allows to specify how the documents should be sorted - by which attributes
    // projection param allows to load only some attributes for each book
    async listBooks(filter = {}, pageInfo = {}, sort = {}, projection = {}) {
        let pageIndex = pageInfo["pageIndex"] ? pageInfo["pageIndex"] : 0;
        let pageSize = pageInfo["pageSize"] ? pageInfo["pageSize"] : 1000;
        let totalCount = await this.count(filter);
        let result = await this._findWrapper(filter, {projection}, pageIndex *
            pageSize, sort, pageSize);
        if (result.code) {
            return result;
        } else {
            return {
            itemList: result,
            pageInfo: {
            pageIndex: pageIndex,
            pageSize: pageSize,
            total: totalCount,
                },
            };
        }
    }
    // deletes the first book that match the code
    async deleteBook(codeStr) {
        //let filter = { code };
        let db = await DbConnection.get(connectionString);
        let status = await db
            .collection(this.wordsCollection)
            .deleteOne({ code : codeStr })
        console.log(status)
        if (!status || !status.acknowledged) {
            throw new Error("Unexpected Error");
        }
    }
    // add
    async addWords(data) {
        let db = await DbConnection.get(connectionString);
        let status = await db
            .collection(this.wordsCollection)
            .insertOne(data)
        console.log(status)
        if (!status || !status.acknowledged) {
            throw new Error("Unexpected Error");
        }
    }
    async addUser(data) {
        let db = await DbConnection.get(connectionString);
        let status = await db
            .collection(this.usersCollection)
            .insertOne(data)
        console.log(status)
        if (!status || !status.acknowledged) {
            throw new Error("Unexpected Error");
        }
    }
    async addAvatar(data) {
        let db = await DbConnection.get(connectionString);
        let status = await db
            .collection(this.avatarsCollection)
            .insertOne(data)
        console.log({status})
        if (!status || !status.acknowledged) {
            throw new Error("Unexpected Error");
        }
        return status
    }
    // update
    async updateUser(user) {
        console.log("user DATA:", user)
        let db = await DbConnection.get(connectionString);
        let status = await db
            .collection(this.usersCollection)
            .updateOne( { _id: ObjectId(user.id) }, { $set: { [user.update.name]: user.update.data } } )
        console.log({status})
        if (!status || !status.acknowledged) {
            throw new Error("Unexpected Error");
        }
    }
    async updateAvatar(avatar) {
        console.log("user DATA:", avatar)
        let db = await DbConnection.get(connectionString);
        let status = await db
            .collection(this.avatarsCollection)
            .updateOne( { _id: ObjectId(avatar.id)}, { $set: { avatar: avatar.avatar } } )
        console.log({status})
        if (!status || !status.acknowledged) {
            throw new Error("Unexpected Error");
        }
    }
    // returns count of all documents that match the filter
    async count(filter) {
        let db = await DbConnection.get(connectionString);
        return await db
            .collection(this.wordsCollection)
            .countDocuments(filter)
        }
    // returns the array of documents according to params
    // filter param allows to filter documents by specific attributes
    // skip and limit allows to specify the page number and page size
    // sort param allows to specify how the documents should be sorted - by which attributes
    // options.projection param allows to load only some attributes for each book
    async _findWrapper(filter, options, skip = 0, sort = {}, limit = 0) {
        let db = await DbConnection.get(connectionString);
        return db
            .collection(this.wordsCollection)
            .find(filter, options)
            .skip(skip)
            .sort(sort)
            .limit(limit)
            .toArray()
        }
}
module.exports = new LibraryDao();
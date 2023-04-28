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
        this.scoresCollection = "score"
        DbConnection.init(connectionString);
 }
    async getWords(date) {
        let db = await DbConnection.get(connectionString);
        return await db
            .collection(this.wordsCollection)
            .findOne({ date: date })
    }

    async getNewestWord() {
        let db = await DbConnection.get(connectionString);
        return await db
            .collection(this.wordsCollection)
            .find().sort({date : -1}).limit(1).toArray()
    }

    async getScoreAndAvatar(filter) {
        console.log({filter})
        let db = await DbConnection.get(connectionString);
        return await db
            .collection(this.scoresCollection)
            .aggregate([ 
                { $match : filter },
                { $lookup: {
                  from: "avatars",
                  localField: "userId",
                  foreignField: "userId",
                  as: "avatarResult"
                }}
              ]).toArray()
    }

    async getUser(filter) {
        console.log(filter)
        let db = await DbConnection.get(connectionString);
        return await db
            .collection(this.usersCollection)
            .findOne(filter)
    }

    async getUsers(filter) {
        let db = await DbConnection.get(connectionString);
        return await db
          .collection(this.usersCollection)
          .distinct('nickname', { nickname: new RegExp(filter, 'i') });
      }
      
      

    async getLeaderboards() {
        const db = await DbConnection.get(connectionString);
        return await db.collection(this.scoresCollection).aggregate([
          {
            $sort: { score: -1 }
          },
          {
            $limit: 5
          },
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "user"
            }
          },
          {
            $lookup: {
              from: "avatars",
              localField: "userId",
              foreignField: "userId",
              as: "avatar"
            }
          },
          {
            $project: {
              _id: "$userId",
              nickname: { $arrayElemAt: ["$user.nickname", 0] },
              avatar:  { $arrayElemAt: ["$avatar.avatar", 0] },
              score: 1
            }
          }
        ]).toArray();
      }
      
      
      

    async getAvatar(filter) {
        console.log("GET AVATAR", filter)
        let db = await DbConnection.get(connectionString);
        return await db
            .collection(this.avatarsCollection)
            .findOne(filter)
    }

    async listScore(filter = {}, limit = 10, sort = {}) {
        let totalCount = await this.count(filter);
        let result = await this._findWrapper(filter, sort, limit);
        console.log({result})
        return {usersCount: totalCount, topScoreArr: result}
    }


    // delete
    async deleteAvatar(id) {
        let db = await DbConnection.get(connectionString);
        let status = await db
            .collection(this.avatarsCollection)
            .deleteOne({ userId : id })
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
    async addScore(userId) {
        let db = await DbConnection.get(connectionString);
        let status = await db
            .collection(this.scoresCollection)
            .insertOne({score: 0, userId: userId})
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
        this.addScore(status.insertedId)
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
            .updateOne( { _id: ObjectId(user.id) }, { [user.operator]: { [user.name]: user.data } } )
        console.log({status})
        if (!status || !status.acknowledged) {
            throw new Error("Unexpected Error");
        }
    }
    async updateChallenge(data) {
        console.log("user DATA:", data)
        let db = await DbConnection.get(connectionString);
        let status = await db
            .collection(this.usersCollection)
            .updateOne( { nickname: data.nickname}, { $set: { "challengeWord": data.word } } )
        console.log({status})
        if (!status || !status.acknowledged) {
            throw new Error("Unexpected Error");
        }
    }
    async updateScore(score) {
        console.log("user DATA:", score)
        let db = await DbConnection.get(connectionString);
        let status = await db
            .collection(this.scoresCollection)
            .updateOne( { userId: ObjectId(score.userId) }, { [score.operator]: { [score.name]: score.data } } )
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
            .collection(this.scoresCollection)
            .countDocuments(filter)
        }

    async _findWrapper(filter, sort = {}, limit = 0) {
        let db = await DbConnection.get(connectionString);
        return db
            .collection(this.scoresCollection)
            .find(filter)
            .sort(sort)
            .limit(limit)
            .toArray()
        }
}
module.exports = new LibraryDao();
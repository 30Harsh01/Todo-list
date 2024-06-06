//way to connect the database
const mongoose = require('mongoose');
const mongoURL = "mongodb://localhost:27017/todolist"

const connectToMongogo = () => {
    mongoose.connect(mongoURL)
        .then(() => {
            console.log('connected to mongodb')
        }).catch((err) => {
            console.log(err)
        })
}
module.exports = connectToMongogo;


//some differnet ways to do the same
/*
const connectToMongoAsyncAwait = async () => {
    try {
        await mongoose.connect(mongoURL);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error(error);
    }
};

const connectToMongoPromise = () => {
    return new Promise((resolve, reject) => {
        mongoose.connect(mongoURL)
            .then(() => {
                console.log('Connected to MongoDB');
                resolve();
            })
            .catch((err) => {
                console.error(err);
                reject(err);
            });
    });
};

const connectToMongoCallback = (callback) => {
    mongoose.connect(mongoURL, (err) => {
      if (err) {
        console.error(err);
        callback(err);
      } else {
        console.log('Connected to MongoDB');
        callback();
      }
    });
};
*/
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDb = async () => {
    try {
        const connect = await mongoose.connect(process.env.MongoDB_URL);
        console.log("mongodb connected :", connect.connection.name);
    }
    catch (err) {
        console.log(err);
        process.exit(1);
    }
}

module.exports = connectDb;

import * as mongoose from 'mongoose';

const uri = process.env.MONGODB_URI as string;

const dbConnect = async () => {
    try {
        const connection  = await mongoose.connect(uri);
        console.log(connection);
        return connection;
    } catch (error) {
        console.log('db connection fails: ', error);
    }
}

export default dbConnect;

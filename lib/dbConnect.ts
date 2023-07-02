import * as mongoose from 'mongoose';

const uri = process.env.MONGODB_URI as string;

const dbConnect = async () => {
    try {
        return await mongoose.connect(uri);
    } catch (error) {
        console.log('db connection fail: ', error);
    }
}

export default dbConnect;

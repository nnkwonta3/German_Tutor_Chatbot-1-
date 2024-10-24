import {connect, disconnect} from "mongoose";
export default async function connectToDatabase() {
    try {
        await connect(process.env.MONGODB_URL);
    } catch (error) {
        console.log(error);
        throw new Error("Could not Connect To Mongoose")
    }
}

async function disconnectFromDatabase() {
    try {
        await disconnect()
    }   catch (error) {
        console.log(error);
        throw new Error("Could not Disconnect To Mongoose")
    }
}

export{connectToDatabase, disconnectFromDatabase}

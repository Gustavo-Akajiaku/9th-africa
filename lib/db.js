import mongoose from "mongoose";

// Connecting DATABASE to the APPLICATION
const MONGODB_URL = process.env.MONGODB_URL

const connect = async () => {
    const connectionState = mongoose.connection.readyState

    if (connectionState === 1) {
        console.log("Already connected");
        return
    }

    if (connectionState === 2) {
      console.log("Connecting...");
      return;
    }

    try {
        mongoose.connect(MONGODB_URL, {
          dbName: "Cluster9th",
          bufferCommands: true,
        });
    } catch (error) {
        console.log("Error: ", error);
        throw new Error("Error: ", error)
    }
}

export default connect;
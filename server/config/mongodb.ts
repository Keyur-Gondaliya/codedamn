import mongoose from "mongoose";
export const url = process.env.DB_URL;

export default function connectDB() {
  if (url) {
    mongoose
      .connect(url, { dbName: "LetsCode" })
      .then(() => {
        console.log("Connected to the database!");
      })
      .catch((err: any) => {
        console.log("Cannot connect to the database!", err);
        process.exit();
      });
  } else {
    console.error("Database URL is undefined.");
  }
}

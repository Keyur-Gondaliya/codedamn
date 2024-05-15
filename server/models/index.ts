import mongoose from "mongoose";
import User from "./user.model";
import Playground from "./playground";

mongoose.Promise = global.Promise;
const db = { playground: Playground, user: User };
export default db;

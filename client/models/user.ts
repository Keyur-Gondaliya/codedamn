import { Schema, model, models, Model } from "mongoose";
export interface UserSchemaInterface {
  username: string;
  email: string;
  image: string;
}
const userSchema = new Schema<UserSchemaInterface>(
  {
    username: {
      type: String,
      required: [true, "Username is Required!"],
      match: [
        /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
        "Username invalid, it should contain 8-20 alphanumeric letters and be unique!",
      ],
    },
    email: {
      type: String,
      required: [true, "Email is Required!"],
    },
    image: { type: String },
  },
  { timestamps: true }
);
const User =
  (models.User as Model<UserSchemaInterface>) || model("User", userSchema);
export default User;

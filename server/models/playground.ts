import mongoose from "mongoose";

var schema = new mongoose.Schema(
  {
    name: String,
    createId: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    playgroundTypeId: String,
    port: Number,
    subDomain: String,
    socketId: String,
    fileSnapshot: [
      {
        key: { type: String, required: true },
        isFolder: { type: Boolean, required: true },
      },
    ],
    isDeleted: { type: Boolean, default: false },
  },

  { timestamps: true }
);

const Playground = mongoose.model("playground", schema);
export default Playground;

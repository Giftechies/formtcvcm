import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  // 🧾 OLD FIELDS (kept for backward compatibility)
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  sex: {
    type: String,
    enum: ["male", "female"],
  },
  age: {
    type: Number,
  },
  password: {
    type: String,
    required: true,
  },
  joinedEvents: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Event",
  },
  accountBanned: {
    type: Boolean,
    default: false,
  },

  // 🌟 NEW FIELDS (from new form)
  lastName: {
    type: String,
    trim: true,
  },
  firstName: {
    type: String,
    trim: true,
  },
  organisation: {
    type: String,
    trim: true,
  },
  title: {
    type: String,
    trim: true,
  },
  telephone: {
    type: String,
    trim: true,
  },
  member: {
    type: String,
    enum: ["yes", "no"],
    default: "no",
  },
  allergies: {
    type: String,
    trim: true,
  },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;

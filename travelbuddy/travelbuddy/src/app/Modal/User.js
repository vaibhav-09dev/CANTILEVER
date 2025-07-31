import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  pic:{
    type:String,
    default:""
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  about: {
    type: String,

  },
  location: {
    type: String,

  },
  age: {
    type: String,

  },
  
  occupation: {
    type: String,

  },
  interests: {
    type: String,

  },
  language: {
    type: String,

  },
  unreadcount: {
  type: Number,
  default: 0,
},
  activity:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "activities",}],
  
   createdAt: {
    type: Date,
    default: Date.now,
  },
});
export default mongoose.models.User||  mongoose.model("User", userSchema);
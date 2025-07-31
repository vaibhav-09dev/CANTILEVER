import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  
  title: {
    type: String,
    required: true,
  },
  descp: {
    type: String,
    required: true,
    
  },
  type: {
    type: String,
    required: true,
  },
  
   date: {
    type: String,
    required: true,
  },
   time: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  user:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
   createdAt: {
    type: Date,
    default: Date.now,
  },
});
export default mongoose.models.activities||  mongoose.model("activities", activitySchema);
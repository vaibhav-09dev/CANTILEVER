import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    from: {
        type: String,
        required: true,
      },
      to: {
        type: String,
        required: true,
        
      },
      message: {
        type: String,
        required: true,
      },
      read: { type: Boolean, default: false },
      timestamp: {
        type: Date,
        default: Date.now,},
      
       
       createdAt: {
        type: Date,
        default: Date.now,
      },

})
export default mongoose.models.Message || mongoose.model("Message", messageSchema);
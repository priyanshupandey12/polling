import mongoose from "mongoose";


const responseSchema = new mongoose.Schema({
  pollId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Poll",
    required: [true, "Poll ID is required"]
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  ipAddress: {
    type: String,
    default: null
  },
  answers: [
    {
      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: true
      },
      selectedOption: {
        type: String,
        required: true
      }
    }
  ]
}, {
  timestamps: true
});


responseSchema.index(
  { pollId: 1, userId: 1 },
  {
    unique: true,
    partialFilterExpression: { userId: { $ne: null } }
  }
);


responseSchema.index(
  { pollId: 1, ipAddress: 1 },
  {
    unique: true,
    partialFilterExpression: { ipAddress: { $ne: null } }
  }
);

const Response = mongoose.model("Response", responseSchema);
export default Response;
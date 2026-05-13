import mongoose from "mongoose";

function arrayLimit(val: string[]) {
    return val.length >= 2;
}

const QSchema = new mongoose.Schema({
    pollId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Poll",
        required: [true, "Poll ID is required"]
    },
    questionText:{
        type: String,  
    },
    isRequired:{
        type: Boolean,
        default: false
    },
    options:{
        type: [String],
        validate: [arrayLimit, "A question must have at least 2 options"]
    }
},{
    timestamps: true
})

const Question = mongoose.model("Question", QSchema);

export default Question;
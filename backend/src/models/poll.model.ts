import mongoose from "mongoose";


const pollSchema = new mongoose.Schema({
    title:{
        type: String,
        required: [true, "Title is required"]
    },
    creatorId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Creator ID is required"]
    },
    desc:{
        type: String,
        
    },
    expiresAt:{
        type: Date,
        required: [true, "Expiration date is required"]
    },
    isAnonymous:{
        type: Boolean,
        default: true
    },
    status:{
        type: String,
        enum: ["active", "closed","published"],
        default: "active"
    }
       
},{
    timestamps: true
})

const Poll = mongoose.model("Poll", pollSchema);

export default Poll;
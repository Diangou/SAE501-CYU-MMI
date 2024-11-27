import mongoose, { Schema } from "mongoose";
import validator from "validator";

const messageShema = new Schema({
    lastName: {
        type: String,
        required: [true, "Veuillez mettre un nom de famille"],
    },
    firstName: {
        type: String,
        required: [true, "Veuillez mettre un prenom"],
    },
    email: {
        type: String,
        validate: [validator.isEmail, "L'adresse email n'est pas correct"],
        required: [true, "Veuillez mettre un email"],
    },
    content: {
        type: String,
        required: [true, "Veuillez mettre un message"],
    },
    identity: {
        type: String,
        enum: ["non_precise", "autre", "etudiant", "parent"],
        default: "non_precise",
    }, 
},
{
    timestamps: { createdAt: "created_at" },
})

export default mongoose.model("Message", messageShema);
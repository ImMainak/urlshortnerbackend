import mongoose from 'mongoose';
const { Schema } = mongoose;

const urlSchema = new Schema({
    userID: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'users'
    },
    shortURL: {
        type: String,
        unique: true
    },
    originalURL: {
        type: String,
        required: true
    },
    qrCode: {
        type: String
    },
    visitHistory: [
        {
            timestamp: {
                type: String,
            }
        }
    ]
}, { timestamps: true });

export default mongoose.model('url', urlSchema);
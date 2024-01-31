import mongoose from 'mongoose';
const { Schema } = mongoose;

const urlSchema = new Schema({
    shortURL: {
        type: String,
        required: true,
        unique: true
    },
    originalURL: {
        type: String,
        required: true
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
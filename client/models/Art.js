import { Schema, model, models } from 'mongoose';

const mongoose = require('mongoose');
const { Schema } = mongoose;

const ArtSchema = new Schema({
    model: { type: String, required: true },
    prompt: { type: String, required: true },
    negative_prompt: { type: String, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    steps: { type: Number, required: true },
    guidance: { type: Number, required: true },
    seed: { type: Number, required: true },
    scheduler: { type: String, required: true },
    address: {
        type: String,
        required: true,
        validate: {
            validator: (v) => /^(\d+)$/.test(v),
            message: `{address} is not an integer value`
        }
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});


const Art = models.Art || model("Art", ArtSchema);

export default Art;
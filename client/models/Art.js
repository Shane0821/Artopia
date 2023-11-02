import { Schema, model, models } from 'mongoose';

// prompt should be set to true later
const ArtSchema = new Schema({
    base64: { type: String, required: true },
    model: { type: String, required: true },
    prompt: { type: String, required: false, default: 'art' },
    negative_prompt: { type: String, required: false },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    steps: { type: Number, required: true },
    guidance: { type: Number, required: true },
    seed: { type: Number, required: true },
    scheduler: { type: String, required: true },
    address: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});


const Art = models.Art || model("Art", ArtSchema);

export default Art;
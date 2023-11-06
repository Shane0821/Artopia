import { Schema, model, models } from 'mongoose';

const ArtIpfsSchema = new Schema({
    art_id: { type: String, required: true },
    ipfs: { type: String, required: true }
});


const ArtIpfs = models.ArtIpfs || model("ArtIpfs", ArtIpfsSchema);

export default ArtIpfs;
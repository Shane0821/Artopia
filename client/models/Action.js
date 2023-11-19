import { Schema, model, models } from 'mongoose';

// Action Schema
const ActionSchema = new Schema({
  artId: { type: Schema.Types.ObjectId, ref: 'Art', required: true },
  likes: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  likedBy: [{ type: String }],
  viewedBy: [{ type: String }]
});

ActionSchema.methods.like = async function (userAddress) {
  if (this.likedBy.includes(userAddress)) {
    return this;
  }
  this.likes += 1;
  this.likedBy.push(userAddress);
  return await this.save();
};

ActionSchema.methods.view = async function (userAddress) {
  if (!this.viewedBy.includes(userAddress)) {
    this.views += 1;
    this.viewedBy.push(userAddress);
  }
  return await this.save();
};

ActionSchema.methods.unview = async function (userAddress) {
  const index = this.viewedBy.indexOf(userAddress);
  if (index > -1) {
    this.views -= 1;
    this.viewedBy.splice(index, 1);
  }
  return await this.save();
};

const Action = models.Action || model("Action", ActionSchema);

export default Action;

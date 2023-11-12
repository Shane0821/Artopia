import { Schema, model } from 'mongoose';

// Action Schema
const ActionSchema = new Schema({
  likes: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  likedBy: [{ type: String }],
  viewedBy: [{ type: String }]
});

ActionSchema.methods.like = function(userAddress) {
  if (this.likedBy.includes(userAddress)) {
    return this;
  }
  this.likes += 1;
  this.likedBy.push(userAddress);
  return this.save();
};

ActionSchema.methods.view = function(userAddress) {
  if (!this.viewedBy.includes(userAddress)) {
    this.views += 1;
    this.viewedBy.push(userAddress);
  }
  return this.save();
};

ActionSchema.methods.unview = function(userAddress) {
  const index = this.viewedBy.indexOf(userAddress);
  if (index > -1) {
    this.views -= 1;
    this.viewedBy.splice(index, 1);
  }
  return this.save();
};

export default model('Action', ActionSchema);

import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  groupName: { type: String },
  messages: { type: Array },
  members: { type: Array },
});

const Group = mongoose.model('Groupes', groupSchema);

export default Group;

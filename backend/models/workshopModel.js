import mongoose from 'mongoose';

const workshopSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    duration: { type: Number, required: true },
    capacity: { type: Number, required: true },

    registeredUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    topics: [{ type: String }],
    price: { type: Number, default: 0 },
    images: [{ type: String }],
    type: { type: String, required: true },
    content: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

const Workshop = mongoose.model('Workshop', workshopSchema);

export default Workshop;

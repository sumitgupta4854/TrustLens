import mongoose, { Document, Schema, Types } from 'mongoose';

export type BoundaryCategory =
  | 'financial'
  | 'physical_intimacy'
  | 'personal_privacy'
  | 'meeting_time'
  | 'communication'
  | 'emotional_pace'
  | 'other';

export interface IBoundary extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
  description: string;
  category: BoundaryCategory;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const boundarySchema = new Schema<IBoundary>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [5, 'Description must be at least 5 characters'],
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'financial',
        'physical_intimacy',
        'personal_privacy',
        'meeting_time',
        'communication',
        'emotional_pace',
        'other',
      ],
      default: 'other',
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for user boundary queries
boundarySchema.index({ userId: 1, isActive: 1 });

export const Boundary = (mongoose.models['Boundary'] as mongoose.Model<IBoundary>) || mongoose.model<IBoundary>('Boundary', boundarySchema);

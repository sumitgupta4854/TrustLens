import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IRefreshSession extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  tokenHash: string;
  tokenFamilyId: string;
  expiresAt: Date;
  revokedAt: Date | null;
  replacedBySessionId: Types.ObjectId | null;
  createdAt: Date;
  lastUsedAt: Date;
  isActive(): boolean;
}

const refreshSessionSchema = new Schema<IRefreshSession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    tokenHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    tokenFamilyId: {
      type: String,
      required: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    revokedAt: {
      type: Date,
      default: null,
    },
    replacedBySessionId: {
      type: Schema.Types.ObjectId,
      ref: 'RefreshSession',
      default: null,
    },
    lastUsedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Method to verify if session is active
refreshSessionSchema.methods.isActive = function (): boolean {
  return !this.revokedAt && this.expiresAt.getTime() > Date.now();
};

export const RefreshSession = (mongoose.models['RefreshSession'] as mongoose.Model<IRefreshSession>) || mongoose.model<IRefreshSession>('RefreshSession', refreshSessionSchema);

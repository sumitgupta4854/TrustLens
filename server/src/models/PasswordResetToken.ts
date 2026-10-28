import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IPasswordResetToken extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  usedAt: Date | null;
  createdAt: Date;
  isValid(): boolean;
}

const passwordResetTokenSchema = new Schema<IPasswordResetToken>(
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
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    usedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

passwordResetTokenSchema.methods.isValid = function (): boolean {
  return !this.usedAt && this.expiresAt.getTime() > Date.now();
};

export const PasswordResetToken = (mongoose.models['PasswordResetToken'] as mongoose.Model<IPasswordResetToken>) || mongoose.model<IPasswordResetToken>(
  'PasswordResetToken',
  passwordResetTokenSchema
);

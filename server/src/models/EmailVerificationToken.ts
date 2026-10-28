import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IEmailVerificationToken extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  usedAt: Date | null;
  createdAt: Date;
  isValid(): boolean;
}

const emailVerificationTokenSchema = new Schema<IEmailVerificationToken>(
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

emailVerificationTokenSchema.methods.isValid = function (): boolean {
  return !this.usedAt && this.expiresAt.getTime() > Date.now();
};

export const EmailVerificationToken = (mongoose.models['EmailVerificationToken'] as mongoose.Model<IEmailVerificationToken>) || mongoose.model<IEmailVerificationToken>(
  'EmailVerificationToken',
  emailVerificationTokenSchema
);

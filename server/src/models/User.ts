import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  normalizedEmail: string;
  passwordHash: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  toSafeObject(): {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    createdAt: string;
  };
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [60, 'Name cannot exceed 60 characters'],
    },
    normalizedEmail: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Method to return safe sanitized user object
userSchema.methods.toSafeObject = function () {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.normalizedEmail,
    emailVerified: this.emailVerified,
    createdAt: this.createdAt.toISOString(),
  };
};

export const User = (mongoose.models['User'] as mongoose.Model<IUser>) || mongoose.model<IUser>('User', userSchema);

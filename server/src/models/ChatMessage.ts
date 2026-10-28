import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IAnalyzedMessageDetail {
  messageId: string;
  role: 'user';
  content: string;
  timestamp: string;
  meaningAndContext: string;
  topic: string;
  intent: string;
  keyPoints: string[];
  questionsAndRequests: string[];
  actionableInsights: string[];
  category: string;
  connectionToExisting?: string;
  analyzedAt: string;
}

export interface IChatMessage extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  messageId: string;
  sessionId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  analyzed: boolean;
  analysis?: IAnalyzedMessageDetail;
  createdAt: Date;
  updatedAt: Date;
}

const analyzedDetailSchema = new Schema<IAnalyzedMessageDetail>(
  {
    messageId: { type: String, required: true },
    role: { type: String, enum: ['user'], default: 'user' },
    content: { type: String, required: true },
    timestamp: { type: String, required: true },
    meaningAndContext: { type: String, required: true },
    topic: { type: String, required: true },
    intent: { type: String, required: true },
    keyPoints: [{ type: String }],
    questionsAndRequests: [{ type: String }],
    actionableInsights: [{ type: String }],
    category: { type: String, default: 'General' },
    connectionToExisting: { type: String },
    analyzedAt: { type: String, default: () => new Date().toISOString() },
  },
  { _id: false }
);

const chatMessageSchema = new Schema<IChatMessage>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    messageId: {
      type: String,
      required: true,
      index: true,
    },
    sessionId: {
      type: String,
      default: 'default',
      index: true,
    },
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    analyzed: {
      type: Boolean,
      default: false,
      index: true,
    },
    analysis: {
      type: analyzedDetailSchema,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for fast querying and deduplication
chatMessageSchema.index({ userId: 1, messageId: 1 }, { unique: true });
chatMessageSchema.index({ userId: 1, analyzed: 1 });
chatMessageSchema.index({ userId: 1, timestamp: -1 });

export const ChatMessageModel =
  mongoose.models.ChatMessage ||
  mongoose.model<IChatMessage>('ChatMessage', chatMessageSchema);

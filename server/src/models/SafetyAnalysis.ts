import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IFinding {
  category: string;
  title: string;
  evidence: string;
  explanation: string;
  confidence: 'low' | 'medium' | 'high';
  recommendedAction: string;
}

export interface ISafetyAnalysis extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  summary: string;
  concernLevel: 'low' | 'moderate' | 'high';
  findings: IFinding[];
  replySuggestions: {
    gentle: string;
    firm: string;
    direct: string;
  };
  safetySteps: string[];
  limitations: string[];
  isOptInSaved: boolean;
  createdAt: Date;
}

const findingSchema = new Schema<IFinding>(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    evidence: { type: String, required: true },
    explanation: { type: String, required: true },
    confidence: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    recommendedAction: { type: String, required: true },
  },
  { _id: false }
);

const safetyAnalysisSchema = new Schema<ISafetyAnalysis>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    summary: {
      type: String,
      required: true,
    },
    concernLevel: {
      type: String,
      enum: ['low', 'moderate', 'high'],
      required: true,
      index: true,
    },
    findings: [findingSchema],
    replySuggestions: {
      gentle: { type: String, default: '' },
      firm: { type: String, default: '' },
      direct: { type: String, default: '' },
    },
    safetySteps: [{ type: String }],
    limitations: [{ type: String }],
    isOptInSaved: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

safetyAnalysisSchema.index({ userId: 1, createdAt: -1 });

export const SafetyAnalysis = (mongoose.models['SafetyAnalysis'] as mongoose.Model<ISafetyAnalysis>) || mongoose.model<ISafetyAnalysis>('SafetyAnalysis', safetyAnalysisSchema);

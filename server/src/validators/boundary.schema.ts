import { z } from 'zod';

export const boundaryCategoryEnum = z.enum([
  'financial',
  'physical_intimacy',
  'personal_privacy',
  'meeting_time',
  'communication',
  'emotional_pace',
  'other',
]);

export const createBoundarySchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Title must be at least 3 characters')
    .max(120, 'Title cannot exceed 120 characters'),
  description: z
    .string()
    .trim()
    .min(5, 'Description must be at least 5 characters')
    .max(500, 'Description cannot exceed 500 characters'),
  category: boundaryCategoryEnum,
  isActive: z.boolean().default(true).optional(),
});

export const updateBoundarySchema = createBoundarySchema.partial();

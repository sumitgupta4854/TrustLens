import { Request, Response, NextFunction } from 'express';
import { Boundary } from '../models/Boundary.js';
import { NotFoundError, UnauthorizedError, ForbiddenError } from '../utils/errors.js';

export const boundaryController = {
  // POST /api/boundaries
  async createBoundary(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required.');
      }

      const { title, description, category, isActive } = req.body;

      const boundary = await Boundary.create({
        userId: req.user._id,
        title: title.trim(),
        description: description.trim(),
        category,
        isActive: isActive !== undefined ? isActive : true,
      });

      return res.status(201).json({
        success: true,
        message: 'Personal boundary created successfully.',
        boundary: {
          id: boundary._id.toString(),
          title: boundary.title,
          description: boundary.description,
          category: boundary.category,
          isActive: boundary.isActive,
          createdAt: boundary.createdAt.toISOString(),
          updatedAt: boundary.updatedAt.toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/boundaries
  async listBoundaries(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required.');
      }

      const filter: Record<string, any> = { userId: req.user._id };
      if (req.query.active !== undefined) {
        filter.isActive = req.query.active === 'true';
      }

      const boundaries = await Boundary.find(filter).sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        boundaries: boundaries.map((b) => ({
          id: b._id.toString(),
          title: b.title,
          description: b.description,
          category: b.category,
          isActive: b.isActive,
          createdAt: b.createdAt.toISOString(),
          updatedAt: b.updatedAt.toISOString(),
        })),
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/boundaries/:id
  async getBoundaryById(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required.');
      }

      const boundary = await Boundary.findById(req.params.id);
      if (!boundary) {
        throw new NotFoundError('Boundary not found.');
      }

      // Strict ownership check
      if (boundary.userId.toString() !== req.user._id.toString()) {
        throw new ForbiddenError('You do not have permission to access this boundary.');
      }

      return res.status(200).json({
        success: true,
        boundary: {
          id: boundary._id.toString(),
          title: boundary.title,
          description: boundary.description,
          category: boundary.category,
          isActive: boundary.isActive,
          createdAt: boundary.createdAt.toISOString(),
          updatedAt: boundary.updatedAt.toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // PATCH /api/boundaries/:id
  async updateBoundary(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required.');
      }

      const boundary = await Boundary.findById(req.params.id);
      if (!boundary) {
        throw new NotFoundError('Boundary not found.');
      }

      // Strict ownership check
      if (boundary.userId.toString() !== req.user._id.toString()) {
        throw new ForbiddenError('You do not have permission to modify this boundary.');
      }

      const { title, description, category, isActive } = req.body;
      if (title !== undefined) boundary.title = title.trim();
      if (description !== undefined) boundary.description = description.trim();
      if (category !== undefined) boundary.category = category;
      if (isActive !== undefined) boundary.isActive = isActive;

      await boundary.save();

      return res.status(200).json({
        success: true,
        message: 'Boundary updated successfully.',
        boundary: {
          id: boundary._id.toString(),
          title: boundary.title,
          description: boundary.description,
          category: boundary.category,
          isActive: boundary.isActive,
          createdAt: boundary.createdAt.toISOString(),
          updatedAt: boundary.updatedAt.toISOString(),
        },
      });
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/boundaries/:id
  async deleteBoundary(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new UnauthorizedError('Authentication required.');
      }

      const boundary = await Boundary.findById(req.params.id);
      if (!boundary) {
        throw new NotFoundError('Boundary not found.');
      }

      // Strict ownership check
      if (boundary.userId.toString() !== req.user._id.toString()) {
        throw new ForbiddenError('You do not have permission to delete this boundary.');
      }

      await Boundary.deleteOne({ _id: boundary._id });

      return res.status(200).json({
        success: true,
        message: 'Boundary deleted successfully.',
      });
    } catch (error) {
      next(error);
    }
  },
};

import { Request, Response } from 'express';
import { Types } from 'mongoose';
import File from '../models/File';

interface SearchQuery {
  owner: Types.ObjectId;
  $or?: { [key: string]: any }[];
  type?: { $regex?: string; $options?: string } | { $in?: string[] };
  createdAt?: { $gte: Date };
}

export const searchFiles = async (req: Request, res: Response) => {
  try {
    const { q, type, dateRange, sortBy, sortOrder } = req.query;
    const query: SearchQuery = { owner: req.user?._id as Types.ObjectId };

    // Search query
    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { type: { $regex: q, $options: 'i' } }
      ];
    }

    // File type filter
    if (type && type !== 'all') {
      switch (type) {
        case 'image':
          query.type = { $regex: '^image/', $options: 'i' };
          break;
        case 'document':
          query.type = {
            $in: [
              'application/pdf',
              'application/msword',
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              'application/vnd.ms-excel',
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              'text/plain'
            ]
          };
          break;
        case 'video':
          query.type = { $regex: '^video/', $options: 'i' };
          break;
        case 'audio':
          query.type = { $regex: '^audio/', $options: 'i' };
          break;
      }
    }

    // Date range filter
    if (dateRange && dateRange !== 'all') {
      const now = new Date();
      let dateFilter = now;

      switch (dateRange) {
        case 'today':
          dateFilter = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'week':
          dateFilter = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          dateFilter = new Date(now.setMonth(now.getMonth() - 1));
          break;
        case 'year':
          dateFilter = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
      }

      query.createdAt = { $gte: dateFilter };
    }

    // Sorting
    const sort: { [key: string]: 1 | -1 } = {};
    switch (sortBy) {
      case 'name':
        sort.name = sortOrder === 'desc' ? -1 : 1;
        break;
      case 'date':
        sort.createdAt = sortOrder === 'desc' ? -1 : 1;
        break;
      case 'size':
        sort.size = sortOrder === 'desc' ? -1 : 1;
        break;
      case 'type':
        sort.type = sortOrder === 'desc' ? -1 : 1;
        break;
    }

    const files = await File.find(query)
      .sort(sort)
      .limit(100);

    res.json(files);
  } catch (error) {
    res.status(500).json({ message: 'Error searching files' });
  }
}; 
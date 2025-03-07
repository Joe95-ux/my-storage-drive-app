import { IUser } from '../models/User';
import { Types } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      file?: Express.Multer.File;
    }

    interface User {
      _id: Types.ObjectId;
      email: string;
      name: string;
    }
  }
}

export {}; 
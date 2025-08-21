import { ObjectId } from 'mongoose';

interface TStory {
  image: string;
  caption?: string | null;
  author: ObjectId;
  reactions?: ObjectId[];
  stars?: ObjectId[];
  isDeleted: boolean;
  expireAt?: Date
}

export default TStory
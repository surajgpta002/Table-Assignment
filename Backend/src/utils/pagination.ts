import { Model } from 'mongoose';

interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  size: number;
}

export const paginate = async <T>(
  model: Model<T>,
  queryParams: any
): Promise<PaginationResult<T>> => {
  const page: number = queryParams.page ? parseInt(queryParams.page) : 1;
  const size: number = queryParams.limit ? parseInt(queryParams.limit) : 10;
  const skip: number = (page - 1) * size;

  const total: number = await model.countDocuments();
  const data: T[] = await model.find().skip(skip).limit(size);

  return { data, total, page, size };
};

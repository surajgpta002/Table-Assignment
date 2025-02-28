import { Model } from "mongoose";

interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  size: number;
}

export const paginateWithAggregation = async <T>(
  model: Model<T>,
  queryParams: any,
  initialPipeline: any[] = []
): Promise<PaginationResult<T>> => {
  const page: number = queryParams.page ? parseInt(queryParams.page) : 1;
  const size: number = queryParams.limit ? parseInt(queryParams.limit) : 10;
  const skip: number = (page - 1) * size;

  const pipeline: any[] = [...initialPipeline];

  const result = await model.aggregate([
    ...pipeline,
    {
      $facet: {
        data: [{ $skip: skip }, { $limit: size }],
        totalCount: [{ $count: "total" }],
      },
    },
  ]);

  const total = result[0].totalCount[0]?.total || 0;
  const data = result[0].data;

  return { data, total, page, size };
};

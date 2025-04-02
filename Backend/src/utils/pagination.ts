import { Model } from "mongoose";

export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  size: number;
}

export const paginateWithAggregation = async <T>(
  model: Model<T>,
  queryParams: { page?: string; limit?: string },
  initialPipeline: any[] = [],

  lightCountQuery?: any
): Promise<PaginationResult<T>> => {
  const page = queryParams.page ? parseInt(queryParams.page) : 1;
  const size = queryParams.limit ? parseInt(queryParams.limit) : 10;
  const skip = (page - 1) * size;

  let total: number;
  let data: T[];

  if (lightCountQuery) {
    total = await model.countDocuments(lightCountQuery);
    data = await model.aggregate([
      ...initialPipeline,
      { $skip: skip },
      { $limit: size },
    ]);
  } else {
    const pipeline = [
      ...initialPipeline,
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: size }],
          totalCount: [{ $count: "total" }],
        },
      },
    ];
    const results = await model.aggregate(pipeline);
    data = results[0].data;
    total = results[0].totalCount[0] ? results[0].totalCount[0].total : 0;
  }

  return { data, total, page, size };
};

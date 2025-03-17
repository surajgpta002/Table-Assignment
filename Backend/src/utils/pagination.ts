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
  initialPipeline: any[] = []
): Promise<PaginationResult<T>> => {
  const page = queryParams.page ? parseInt(queryParams.page) : 1;
  const size = queryParams.limit ? parseInt(queryParams.limit) : 10;
  const skip = (page - 1) * size;

  const pipeline: any[] = [...initialPipeline];

  const execResult = await Promise.all([
    model.aggregate(pipeline).skip(skip).limit(size),
    model.aggregate(pipeline).count("total"),
  ]);
  const data = execResult[0];
  const total = execResult[1]?.[0]?.total;

  // pipeline.push({
  //   $facet: {
  //     paginatedData: [{ $skip: skip }, { $limit: size }],
  //     totalCount: [{ $count: "total" }],
  //   },
  // });
  // const result = await model.aggregate(pipeline);

  // const total = result[0]?.totalCount?.[0]?.total || 0;
  // const data = result[0]?.paginatedData || [];

  return { data, total, page, size };
};

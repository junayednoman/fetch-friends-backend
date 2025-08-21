import { AppError } from "../../classes/appError";
import QueryBuilder from "../../classes/queryBuilder";
import Post from "../post/post.model";
import { TReport } from "./reports.interface";
import { Report } from "./reports.model";

const createReport = async (payload: TReport) => {
  const post = await Post.findById(payload.post);
  if (!post) throw new AppError(404, "Post not found");
  const existing = await Report.findOne({ post: payload.post, reporter: payload.reporter });
  if (existing) throw new AppError(400, "You have already reported this post");
  const result = await Report.create(payload);
  return result;
};

const getAllReports = async (query: Record<string, any>) => {
  const searchableFields = ["status"];

  const reportQuery = new QueryBuilder(Report.find(), query)
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .selectFields();

  const meta = await reportQuery.countTotal();
  const result = await reportQuery.queryModel.populate([
    {
      path: "reporter", select: "user role",
      populate: { path: "user", select: "name image" }
    },
  ])
  return { data: result, meta };
};

const getReportById = async (id: string) => {
  const report = await Report.findById(id).populate([
    {
      path: "reporter", select: "user role",
      populate: { path: "user" }
    },
    {
      path: "post"
    }
  ])
  if (!report) throw new AppError(404, "Report not found");
  return report;
};

const updateReport = async (id: string, payload: { status: string }) => {
  const report = await Report.findById(id);
  if (!report) throw new AppError(404, "Report not found");

  const result = await Report.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

const deleteReport = async (id: string, userId: string) => {
  const report = await Report.findById(id);
  if (!report) throw new AppError(404, "Report not found");
  if (report.reporter.toString() !== userId) throw new AppError(403, "Unauthorized to delete this report");

  const result = await Report.findByIdAndDelete(id);
  return result;
};

const reportService = {
  createReport,
  getAllReports,
  getReportById,
  updateReport,
  deleteReport,
};

export default reportService;
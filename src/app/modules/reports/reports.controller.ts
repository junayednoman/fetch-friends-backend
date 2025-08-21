import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { successResponse } from "../../utils/successResponse";
import reportService from "./reports.service";

const createReport = handleAsyncRequest(async (req: any, res) => {
  const payload = req.body;
  payload.reporter = req.user.id;
  const result = await reportService.createReport(payload);
  successResponse(res, {
    message: "Report created successfully!",
    data: result,
    status: 201,
  });
});

const getAllReports = handleAsyncRequest(async (req: any, res) => {
  const result = await reportService.getAllReports(req.query);
  successResponse(res, {
    message: "Reports retrieved successfully!",
    data: result,
  });
});

const getReportById = handleAsyncRequest(async (req: any, res) => {
  const result = await reportService.getReportById(req.params.id);
  successResponse(res, {
    message: "Report retrieved successfully!",
    data: result,
  });
});

const updateReport = handleAsyncRequest(async (req: any, res) => {
  const result = await reportService.updateReport(req.params.id, req.body);
  successResponse(res, {
    message: "Report updated successfully!",
    data: result,
  });
});

const deleteReport = handleAsyncRequest(async (req: any, res) => {
  const result = await reportService.deleteReport(req.params.id, req.user.id);
  successResponse(res, {
    message: "Report deleted successfully!",
    data: result,
  });
});

const reportController = {
  createReport,
  getAllReports,
  getReportById,
  updateReport,
  deleteReport,
};

export default reportController;
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { successResponse } from "../../utils/successResponse";
import businessPartnerService from "./businessPartner.service";

const signUpBusinessPartner = handleAsyncRequest(async (req: any, res) => {
  const result = await businessPartnerService.signUpBusinessPartner(req.body);
  successResponse(res, {
    message: "Business partner signed up successfully!",
    data: result,
    status: 201,
  });
});

const getBusinessPartnerProfile = handleAsyncRequest(async (req: any, res) => {
  const result = await businessPartnerService.getBusinessPartnerProfile(req.user.id);
  successResponse(res, {
    message: "Business partner profile retrieved successfully!",
    data: result,
  });
});

const getAllBusinessPartners = handleAsyncRequest(async (req: any, res) => {
  const result = await businessPartnerService.getAllBusinessPartners(req.query);
  successResponse(res, {
    message: "Business partners retrieved successfully!",
    data: result,
  });
});

const getSingleBusinessPartner = handleAsyncRequest(async (req: any, res) => {
  const result = await businessPartnerService.getSingleBusinessPartner(req.params.id);
  successResponse(res, {
    message: "Business partner retrieved successfully!",
    data: result,
  });
});

const updateBusinessPartnerProfile = handleAsyncRequest(async (req: any, res) => {
  const payload = JSON.parse(req.body.payload || "{}");
  const result = await businessPartnerService.updateBusinessPartnerProfile(req.user.id, payload, req.files);
  successResponse(res, {
    message: "Business partner profile updated successfully!",
    data: result,
  });
});

const businessPartnerController = {
  signUpBusinessPartner,
  getBusinessPartnerProfile,
  getAllBusinessPartners,
  getSingleBusinessPartner,
  updateBusinessPartnerProfile
}

export default businessPartnerController;
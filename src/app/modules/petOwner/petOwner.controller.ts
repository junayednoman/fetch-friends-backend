import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { successResponse } from "../../utils/successResponse";
import petOwnerService from "./petOwner.service";

const signUpPetOwner = handleAsyncRequest(async (req: any, res) => {
  const result = await petOwnerService.signUpPetOwner(req.body);
  successResponse(res, {
    message: "Pet owner signed up successfully!",
    data: result,
    status: 201,
  });
});

const getPetOwnerProfile = handleAsyncRequest(async (req: any, res) => {
  const result = await petOwnerService.getPetOwnerProfile(req.user.id);
  successResponse(res, {
    message: "Pet owner profile retrieved successfully!",
    data: result,
  });
});

const getSinglePetOwner = handleAsyncRequest(async (req: any, res) => {
  const result = await petOwnerService.getSinglePetOwner(req.params.id);
  successResponse(res, {
    message: "Pet owner retrieved successfully!",
    data: result,
  });
});

const updatePetOwnerProfile = handleAsyncRequest(async (req: any, res) => {
  const payload = JSON.parse(req.body.payload || "{}");
  const result = await petOwnerService.updatePetOwnerProfile(req.user.id, payload, req.files);
  successResponse(res, {
    message: "Pet owner profile updated successfully!",
    data: result,
  });
});

const getAllPetOwners = handleAsyncRequest(async (req: any, res) => {
  const result = await petOwnerService.getAllPetOwners(req.query)
  successResponse(res, {
    message: "Pet owners retrieved successfully!",
    data: result,
  });
});

const PetOwnerController = {
  signUpPetOwner,
  getPetOwnerProfile,
  getSinglePetOwner,
  updatePetOwnerProfile,
  getAllPetOwners
};

export default PetOwnerController;

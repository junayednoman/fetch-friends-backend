import { startSession } from "mongoose";
import { AppError } from "../../classes/appError";
import Auth from "../auth/auth.model";
import { TPetOwnerSignUp, TPetOwnerUpdate } from "./petOwner.validation";
import generateOTP from "../../utils/generateOTP";
import config from "../../config";
import bcrypt from "bcrypt";
import { PetOwner } from "./petOwner.model";
import { userRoles } from "../../constants/global.constant";
import { sendEmail } from "../../utils/sendEmail";
import fs from "fs";
import { uploadToS3 } from "../../utils/multerS3Uploader";
import { deleteFileFromS3 } from "../../utils/deleteFileFromS3";
import QueryBuilder from "../../classes/queryBuilder";

const signUpPetOwner = async ({ password, referralCode, ...payload }: TPetOwnerSignUp) => {
  const auth = await Auth.findOne({ email: payload.email, isAccountVerified: true });
  if (auth) {
    throw new AppError(400, "User already exists!");
  }

  const session = await startSession();
  session.startTransaction();
  try {
    const petOwner = await PetOwner.findOneAndUpdate({ email: payload.email }, payload, { upsert: true, new: true, session });
    const hashedPassword = await bcrypt.hash(
      password,
      Number(config.salt_rounds)
    );

    // prepare auth data
    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(
      otp.toString(),
      Number(config.salt_rounds)
    );

    const otpExpires = new Date(Date.now() + 3 * 60 * 1000);

    const authData = {
      email: payload.email,
      password: hashedPassword,
      user: petOwner?._id,
      role: userRoles.petOwner,
      otp: hashedOtp,
      otpExpires,
      referralCode,
      otpAttempts: 0,
    }

    await Auth.findOneAndUpdate({ email: payload.email }, authData, { upsert: true, new: true, session });
    if (petOwner) {
      // send otp
      const emailTemplatePath = "./src/app/emailTemplates/otp.html";
      const subject = `Your OTP Code is Here - Fetch Friends`;
      const year = new Date().getFullYear().toString();
      fs.readFile(emailTemplatePath, "utf8", (err, data) => {
        if (err) throw new AppError(500, err.message || "Something went wrong");
        const emailContent = data
          .replace('{{otp}}', otp.toString())
          .replace('{{year}}', year);

        sendEmail(payload.email, subject, emailContent);
      })
    }

    await session.commitTransaction();
    return petOwner;
  } catch (error: any) {
    await session.abortTransaction();
    throw new AppError(500, error.message || "Error signing up teacher!");
  } finally {
    session.endSession();
  }
}

const getPetOwnerProfile = async (petOwnerId: string) => {
  const owner = await Auth.findById(petOwnerId).populate("user").select("user role");
  return owner;
}
const getAllPetOwners = async (query: Record<string, any>) => {
  const searchableFields = ["name email image"];

  const ownerQuery = new QueryBuilder(PetOwner.find(), query)
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .selectFields();

  const meta = await ownerQuery.countTotal();
  const result = await ownerQuery.queryModel;
  return { data: result, meta };
}

const getSinglePetOwner = async (petOwnerId: string) => {
  const owner = await Auth.findById(petOwnerId).populate("user").select("user role");
  return owner;
}

const updatePetOwnerProfile = async (petOwnerId: string, payload: TPetOwnerUpdate, files?: any) => {
  const owner = await Auth.findById(petOwnerId).populate("user").select("user role");
  const fileArray = Object.keys(files);

  for (const file of fileArray) {
    const uploadedUrl = await uploadToS3(files[file][0]);
    // @ts-ignore
    payload[file] = uploadedUrl;
  }
  const result = await PetOwner.findByIdAndUpdate(owner?.user, payload, { new: true });
  if (result && fileArray.length > 0) {
    for (const file of fileArray) {
      // @ts-ignore
      if (payload[file] && owner.user[file]) {
        // @ts-ignore
        await deleteFileFromS3(owner.user[file]);
      }
    }
  }
  return result;
}

const petOwnerService = {
  signUpPetOwner,
  getPetOwnerProfile,
  getSinglePetOwner,
  updatePetOwnerProfile,
  getAllPetOwners
}

export default petOwnerService
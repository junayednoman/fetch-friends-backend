import { startSession } from "mongoose";
import { AppError } from "../../classes/appError";
import Auth from "../auth/auth.model";
import { TBusinessPartnerSignup } from "./businessPartner.validation";
import bcrypt from "bcrypt";
import { BusinessPartner } from "./businessPartner.model";
import generateOTP from "../../utils/generateOTP";
import config from "../../config";
import { userRoles } from "../../constants/global.constant";
import { sendEmail } from "../../utils/sendEmail";
import fs from "fs";
import QueryBuilder from "../../classes/queryBuilder";
import { uploadToS3 } from "../../utils/multerS3Uploader";
import { deleteFileFromS3 } from "../../utils/deleteFileFromS3";

const signUpBusinessPartner = async ({ password, ...payload }: TBusinessPartnerSignup) => {
  const auth = await Auth.findOne({ email: payload.email, isAccountVerified: true });
  if (auth) {
    throw new AppError(400, "User already exists!");
  }

  const session = await startSession();
  session.startTransaction();
  try {
    const referralCode = generateOTP()
    payload.code = referralCode.toString();
    const existingPartner = await BusinessPartner.findOne({ code: payload.code })
    if (existingPartner) throw new AppError(400, "Referral code already exists!");
    const partner = await BusinessPartner.findOneAndUpdate({ email: payload.email }, payload, { upsert: true, new: true, session });
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
      user: partner?._id,
      role: userRoles.businessPartner,
      otp: hashedOtp,
      otpExpires,
      referralCode,
      otpAttempts: 0,
    }

    await Auth.findOneAndUpdate({ email: payload.email }, authData, { upsert: true, new: true, session });
    if (partner) {
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
    return partner;
  } catch (error: any) {
    await session.abortTransaction();
    throw new AppError(500, error.message || "Error signing up business partner!");
  } finally {
    session.endSession();
  }
};

const getBusinessPartnerProfile = async (businessPartnerId: string) => {
  const partner = await Auth.findById(businessPartnerId).populate("user").select("user role");
  return partner;
};

const getAllBusinessPartners = async (query: Record<string, any>) => {
  const searchableFields = ["name", "email", "location", "phone"];

  const partnerQuery = new QueryBuilder(BusinessPartner.find(), query)
    .search(searchableFields)
    .filter()
    .sort()
    .paginate()
    .selectFields();

  const meta = await partnerQuery.countTotal();
  const result = await partnerQuery.queryModel;
  return { data: result, meta };
};

const getSingleBusinessPartner = async (businessPartnerId: string) => {
  const partner = await Auth.findById(businessPartnerId).populate("user").select("user role");
  return partner;
};

const updateBusinessPartnerProfile = async (businessPartnerId: string, payload: any, files?: any) => {
  const partner = await Auth.findById(businessPartnerId).populate("user").select("user role");
  const fileArray = Object.keys(files || {});

  for (const file of fileArray) {
    const uploadedUrl = await uploadToS3(files[file][0]);
    payload[file] = uploadedUrl;
  }
  const result = await BusinessPartner.findByIdAndUpdate(partner?.user, payload, { new: true });
  if (result && fileArray.length > 0) {
    for (const file of fileArray) {
      // @ts-ignore
      if (payload[file] && partner?.user[file]) {
        // @ts-ignore
        await deleteFileFromS3(partner.user[file]);
      }
    }
  }
  return result;
};

const businessPartnerService = {
  signUpBusinessPartner,
  getBusinessPartnerProfile,
  getAllBusinessPartners,
  getSingleBusinessPartner,
  updateBusinessPartnerProfile,
};

export default businessPartnerService;
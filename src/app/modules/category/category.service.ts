import { AppError } from "../../classes/appError";
import { deleteFileFromS3 } from "../../utils/deleteFileFromS3";
import deleteLocalFile from "../../utils/deleteLocalFile";
import { uploadToS3 } from "../../utils/multerS3Uploader";
import { TCategory } from "./category.interface";
import Category from "./category.model";

const createCategory = async (payload: TCategory, file: any) => {
  const category = await Category.findOne({ name: payload.name });
  if (category) {
    await deleteLocalFile(file.filename);
    throw new AppError(400, "Category already exists");
  }
  const image = await uploadToS3(file);
  payload.image = image;
  const result = await Category.create(payload);
  return result;
};

const getAllCategories = async (searchText: string) => {
  const result = await Category.find({
    $or: [
      { name: { $regex: searchText, $options: "i" } },
    ]
  });
  return result;
};

const getSingleCategory = async (_id: string) => {
  const result = await Category.findById(_id);
  return result;
};

const updateCategory = async (
  _id: string,
  payload: TCategory,
  file?: any
) => {
  const category = await Category.findById(_id);
  if (!category) {
    await deleteLocalFile(file.filename);
    throw new AppError(404, "Category not found");
  }

  if (file) {
    const image = await uploadToS3(file);
    payload.image = image;
  }

  const result = await Category.findOneAndUpdate({ _id }, payload, {
    new: true,
  });

  // delete old image from s3 bucket
  if (result && file) {
    await deleteFileFromS3(category.image);
  }
  return result;
};

const deleteCategory = async (id: string) => {
  const category = await Category.findById(id);
  if (!category) throw new AppError(404, "Category not found");

  const result = await Category.findByIdAndDelete(id);

  if (result) {
    await deleteFileFromS3(category.image);
  }

  return result;
};

const categoryServices = {
  createCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
};
export default categoryServices;

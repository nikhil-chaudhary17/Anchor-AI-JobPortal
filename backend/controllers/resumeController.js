import cloudinary from "../utils/cloudinary.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import User from "../models/userSchema.js";
import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";

const allowedTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const uploadResumeHandler = async (req, res, next) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No resume file uploaded" });
    }

    if (!allowedTypes.includes(req.file.mimetype)) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Only PDF and DOCX files are allowed",
        });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.resume?.publicId) {
      await cloudinary.uploader.destroy(user.resume.publicId, {
        resource_type: "raw",
      });
    }

    const result = await uploadToCloudinary(req.file.buffer, "resumes");

    let extractedText = "";
    if (req.file.mimetype === "application/pdf") {
      const parser = new PDFParse({ data: req.file.buffer });
      const parsed = await parser.getText();

      extractedText = parsed.text;

      await parser.destroy();
    } else if (
      req.file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const parsed = await mammoth.extractRawText({ buffer: req.file.buffer });
      extractedText = parsed.value;
    }

    user.resume = {
      url: result.secure_url,
      publicId: result.public_id,
      extractedText,
      uploadedAt: new Date(),
    };
    await user.save();

    res.status(200).json({ success: true, result: { resume: user.resume } });
  } catch (error) {
    next(error);
  }
};



export const uploadApplicationResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No resume file uploaded",
      });
    }

    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: "Only PDF and DOCX files are allowed",
      });
    }

    const result = await uploadToCloudinary(
      req.file.buffer,
      "application-resumes"
    );

    let extractedText = "";

    if (req.file.mimetype === "application/pdf") {
      const parser = new PDFParse({
        data: req.file.buffer,
      });

      const parsed = await parser.getText();
      extractedText = parsed.text;

      await parser.destroy();
    } else if (
      req.file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const parsed = await mammoth.extractRawText({
        buffer: req.file.buffer,
      });

      extractedText = parsed.value;
    }

    return res.status(200).json({
      success: true,
      result: {
        resume: {
          url: result.secure_url,
          publicId: result.public_id,
          extractedText,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
import type { UploadApiResponse } from "cloudinary";
import cloudinary from "./cloudinary";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function uploadImage(file: File) {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File size must be less than 10MB.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const result = await new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "posts",
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }

          if (!result) {
            reject(new Error("Upload failed"));
            return;
          }

          resolve(result);
        }
      )
      .end(buffer);
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}

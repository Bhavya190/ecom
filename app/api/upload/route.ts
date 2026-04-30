import { NextResponse } from "next/server";
import { type UploadApiResponse } from "cloudinary";
import cloudinary from "@/lib/cloudinary";

import { isAdminSession } from "@/lib/admin";

export const runtime = "nodejs";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const VIDEO_TYPES = ["video/mp4", "video/quicktime"];
const IMAGE_MAX_SIZE = 10 * 1024 * 1024;
const VIDEO_MAX_SIZE = 50 * 1024 * 1024;

function uploadToCloudinary(buffer: Buffer, resourceType: "image" | "video") {
  return new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "art-by-dhruvangi/products",
        resource_type: resourceType
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }

        resolve(result);
      }
    );

    stream.end(buffer);
  });
}

export async function POST(request: Request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    return NextResponse.json(
      { message: "Cloudinary environment variables are not configured" },
      { status: 500 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
  }

  const resourceType = IMAGE_TYPES.includes(file.type)
    ? "image"
    : VIDEO_TYPES.includes(file.type)
      ? "video"
      : null;

  if (!resourceType) {
    return NextResponse.json(
      { message: "Unsupported file type. Use jpg, png, webp, mp4, or mov." },
      { status: 400 }
    );
  }

  const maxSize = resourceType === "image" ? IMAGE_MAX_SIZE : VIDEO_MAX_SIZE;

  if (file.size > maxSize) {
    return NextResponse.json(
      {
        message:
          resourceType === "image"
            ? "Images must be 10MB or smaller"
            : "Videos must be 50MB or smaller"
      },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await uploadToCloudinary(buffer, resourceType);

  return NextResponse.json({
    url: result.secure_url,
    publicId: result.public_id,
    resourceType
  });
}

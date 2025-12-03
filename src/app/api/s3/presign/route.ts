import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
  },
});

export async function POST(request: Request) {
  const { fileName, fileType } = await request.json();
  const key = `orders/${fileName}-${Date.now()}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
    ContentType: fileType,
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 5 }); // 5 min

  return Response.json({
    uploadUrl,
    fileKey: key,
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");

  if (!key) {
    return new Response("Missing key", { status: 400 });
  }

  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
  });

  // Tạo presigned GET URL, sống 5 phút
  const signedUrl = await getSignedUrl(s3, command, {
    expiresIn: 60 * 5,
  });

  return Response.json({
    url: signedUrl,
  });
}

/* async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
  const file = e.target.files?.[0];
  if (!file) return;

  // Validate file type
  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "images/*",
  ];

  if (!allowedTypes.includes(file.type)) {
    alert("Only PDF, DOCX, and image files are allowed");
    return;
  }

  setIsUploading(true);

  try {
    // 1. Get presigned URL from our API
    const presignRes = await fetch("/api/s3/presign", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
      }),
    });

    if (!presignRes.ok) {
      throw new Error("Failed to get presigned URL");
    }

    const { uploadUrl, fileUrl } = await presignRes.json();

    // 2. Upload file directly to S3
    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    if (!uploadRes.ok) {
      throw new Error("Failed to upload file");
    }

    // Extract key from fileUrl for future reference
    const urlParts = fileUrl.split("/");
    const key = urlParts.slice(3).join("/"); // Remove protocol and domain

    // Add to uploaded files list
    const newFile: UploadedFile = {
      name: file.name,
      fileUrl,
      key,
    };

    setUploadedFiles((prev) => [...prev, newFile]);
    console.log("Uploaded!", fileUrl);

    // Clear the input
    e.target.value = "";
  } catch (error) {
    console.error("Upload failed:", error);
    alert("Upload failed. Please try again.");
  } finally {
    setIsUploading(false);
  }
}

async function handleRetrieve() {
  if (!retrieveKey.trim()) {
    alert("Please enter a file key");
    return;
  }

  setIsRetrieving(true);

  try {
    const res = await fetch(`/api/s3/presign-read?key=${encodeURIComponent(retrieveKey)}`);

    if (!res.ok) {
      throw new Error("Failed to get presigned URL");
    }

    const data = await res.json();
    setRetrievedUrl(data.url);
  } catch (error) {
    console.error("Retrieve failed:", error);
    alert("Failed to retrieve file. Please check the key and try again.");
  } finally {
    setIsRetrieving(false);
  }
} */

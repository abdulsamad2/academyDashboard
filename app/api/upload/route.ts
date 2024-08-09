import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, formidable will handle it
  },
};

export default async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests are allowed" });
    return;
  }

  const form = new formidable.IncomingForm();
  const uploadDir = path.join(process.cwd(), "public/uploads");

  // Ensure the upload directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  form.uploadDir = uploadDir;
  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if (err) {
      res.status(500).json({ message: "File upload failed" });
      return;
    }
    // You can also handle the uploaded file here, e.g., save file info in a DB
    res.status(200).json({ message: "File uploaded successfully", files });
  });
};

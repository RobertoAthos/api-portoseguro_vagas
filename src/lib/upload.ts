// upload file

import multer from "multer";

export const uploadResume = () => {
  try {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "uploads/resumes");
      },
      filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
      },
    });

    // File filter for accepting only PDF and Word documents
    const fileFilter = (req: any, file: any, cb: any) => {
      if (
        file.mimetype === "application/pdf" ||
        file.mimetype === "application/msword"
      ) {
        cb(null, true);
      } else {
        cb(new Error("Formato inválido, apenas aceitamos PDF ou Word"));
      }
    };

    // Initialize the multer middleware
    return multer({ storage, fileFilter }).single("cv");
  } catch (error: any) {
    console.log(error);
    console.log(error.message);
  }
};

export const uploadAvatar = () => {
  try {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, "uploads/avatar");
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, "avatar-" + uniqueSuffix + ".png");
      },
    });

    // File filter for accepting only image files
    const fileFilter = (req: any, file: any, cb: any) => {
      if (file.mimetype.startsWith("image/")) {
        cb(null, true);
      } else {
        cb(new Error("Formato inválido, apenas (JPEG, PNG) são aceitos."));
      }
    };

    return multer({
      storage,
      fileFilter,
      limits: {
        fileSize: 1024 * 1024,
      },
    }).single("photo");
  } catch (error:any) {
    console.log(error);
    console.log(error.message);
  }
};

import path from "path";
import multer from "multer";

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null, 'uploads')
    },
    filename: (req,file,cb)=>{
        const ext = path.extname(file.originalname)
        cb(null, Date.now() + ext)
    }
})

export const upload = multer({storage: storage})
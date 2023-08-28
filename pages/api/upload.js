import formidable from "formidable";
import path from "path";
import * as fs from "fs";


import { lazyFundNode, uploadFileToArweave } from "../../utils/utils"


export const config = {
    api: {
        bodyParser: false,
    },
};

const readFile = (req) => {
    const options = {};
    options.uploadDir = path.join(process.cwd(), "/uploads/images");
    options.filename = (name, ext, path, form) => {
        return Date.now().toString() + "_" + path.originalFilename;
    };

    options.maxFileSize = 4000 * 1024 * 1024;
    const form = formidable(options);
    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            resolve({ fields, files });
        });
    });
};

const handler = async (req, res) => {
    try {
        fs.mkdirSync(path.join(process.cwd() + "/uploads", "/images"), {
            recursive: true,
        });
        const { fields, files } = await readFile(req);
        const filepath = files.file[0].filepath;
        //get the size of the file we want to upload
        const { size } = fs.statSync(filepath);
        //fund the Node
        await lazyFundNode(size);
        //upload the file to Arweave
        const transId = await uploadFileToArweave(filepath, JSON.parse(fields.metadata));
        fs.unlinkSync(filepath);
        res.status(200).json(transId);
    } catch (error) {
        console.log("error ", error)
        res.status(400).json({ error: error });
    }
};


export default handler;


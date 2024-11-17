import express from "express";

const router = express.Router();

router.post('/test-file-upload', (req, res) => {
    console.log('Request received');
    console.log('Headers:', req.headers);
    console.log('Content-Type:', req.headers['content-type']);
    console.log('Files:', req.files);
    console.log('Body:', req.body);

    if (!req.files) {
        return res.status(400).json({
            status: 'error',
            message: 'No files object in request',
            headers: req.headers,
            contentType: req.headers['content-type'],
            filesObject: req.files,
            body: req.body
        });
    }

    const file = req.files.profileImage;
    console.log('Received file:', file);

    res.json({
        status: 'success',
        message: 'Files object exists',
        files: req.files
    });
});
export default router;



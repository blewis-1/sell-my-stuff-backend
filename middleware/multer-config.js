const multer = require('multer');

/**
 * Configure multer.diskStorage 
 *  1 - destination to save the file
 *  2 - get the file name
 *      Extension
 */
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        const fileName = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        const uniqueString = Date.now() + '-' + Math.round(Math.random() * 1E9);
        callback(null, fileName + uniqueString + '.' + extension);
    }
});

module.exports = multer({ storage: storage }).single('image');
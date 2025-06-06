const sharp = require('sharp');

async function cropImage({ image, height = 1080, width = 1920, fit = 'contain' }) {
    return await sharp(image).resize({ height: height, width: width, fit: fit }).toBuffer();
}

module.exports = cropImage;
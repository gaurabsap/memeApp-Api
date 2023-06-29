const getFileTypeFromBase64 = (base64Data) => {
    const dataUrlRegex = /^data:([^;]+);base64,/i;
    const matches = base64Data.match(dataUrlRegex);
  
    if (!matches || matches.length !== 2) {
      throw new Error('Invalid base64 encoded data');
    }
  
    const mimeType = matches[1];
  
    if (mimeType.startsWith('data:image/')) {
      return 'image';
    } else if (mimeType.startsWith('data:video/')) {
      return 'video';
    } else {
      return 'unknown';
    }
  };

  module.exports = getFileTypeFromBase64;
export const isImageLink = (url) => {
    const imageExtensions = /\.(jpg|jpeg|png|gif|bmp)$/i; // Case-insensitive matching for common image extensions
    return imageExtensions.test(url);
}
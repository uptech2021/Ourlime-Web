/**
 * Sets the canvas preview of the cropped image.
 * This function takes an image, a canvas, and the crop coordinates,
 * and draws the cropped image on the canvas.
 * The canvas is first cleared, then the image is drawn onto it.
 * The canvas is then returned.
 * @param {HTMLImageElement} image
 * @param {HTMLCanvasElement} canvas
 * @param {PixelCrop} crop
 * @returns {HTMLCanvasElement}
 */
const setCanvasPreview = (
  image, // HTMLImageElement
  canvas, // HTMLCanvasElement
  crop // PixelCrop
) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("No 2d context");
  }

  const pixelRatio = window.devicePixelRatio;
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  // Set canvas dimensions
  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Adjust scaling
  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = "high";

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  // Translate to crop coordinates
  ctx.translate(-cropX, -cropY);

  // Draw cropped area
  ctx.drawImage(
    image,
    cropX, // Source X
    cropY, // Source Y
    crop.width * scaleX, // Source width
    crop.height * scaleY, // Source height
    0, // Destination X
    0, // Destination Y
    canvas.width, // Destination width
    canvas.height // Destination height
  );

  return canvas;
};

export default setCanvasPreview;

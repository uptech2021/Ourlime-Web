export default async function getCroppedImg(imageSrc, crop) {
    const image = new Image();
    image.src = imageSrc;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
  
    const { width, height } = crop;
    canvas.width = width;
    canvas.height = height;
  
    ctx.drawImage(
      image,
      crop.x,
      crop.y,
      width,
      height,
      0,
      0,
      width,
      height
    );
  
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (!blob) {
            reject('Canvas is empty');
            return;
          }
          const file = new File([blob], 'cropped.jpg', { type: 'image/jpeg' });
          resolve(file);
        }, 'image/jpeg');
      });
      
  }
  
import pica from "pica";

const picaInstance = pica();

export const resizeImage = async (file: File) => {
  const img = new Image();
  img.src = URL.createObjectURL(file);

  await img.decode();

  const canvas = document.createElement("canvas");

  canvas.width = 1400;
  canvas.height = (img.height / img.width) * canvas.width; // maintain aspect ratio

  // Resize the image with Pica
  const blob = await picaInstance
    .resize(img, canvas)
    .then((result) => picaInstance.toBlob(result, "image/jpeg", 0.9))
    .then((blob) => {
      return blob;
    });
  return blob;
};

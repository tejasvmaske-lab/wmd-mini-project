import { useState } from "react";
import { useCardContext } from "./CardContext";

const wrapCanvasText = (context, text, maxWidth) => {
  const lines = [];
  let line = "";

  String(text).split(/\s+/).forEach((word) => {
    let remaining = word;

    while (
      remaining &&
      context.measureText(`${line}${line ? " " : ""}${remaining}`).width > maxWidth
    ) {
      if (line) {
        lines.push(line);
        line = "";
        continue;
      }

      let fittingWord = "";
      for (const character of remaining) {
        if (context.measureText(fittingWord + character).width > maxWidth && fittingWord) {
          break;
        }
        fittingWord += character;
      }
      lines.push(fittingWord);
      remaining = remaining.slice(fittingWord.length);
    }

    if (remaining) {
      line = `${line}${line ? " " : ""}${remaining}`;
    }
  });

  if (line) lines.push(line);
  return lines.length ? lines : [""];
};

const loadCardPetImage = (imageURL) => new Promise((resolve) => {
  if (!imageURL) {
    resolve(null);
    return;
  }

  const image = new Image();
  if (!imageURL.startsWith("data:")) {
    image.crossOrigin = "anonymous";
  }
  image.onload = () => resolve(image);
  image.onerror = () => resolve(null);
  image.src = imageURL;
});

const createPetCardImage = async (pet) => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Your browser could not prepare the pet card image.");
  }

  const petImage = await loadCardPetImage(pet.imageURL);
  const width = 960;
  const padding = 56;
  const valueX = 228;
  const valueWidth = width - padding - valueX;
  const rows = [
    ["Pet ID", pet.id],
    ["Species", pet.species],
    ["Breed", pet.breed],
    ["Age", `${pet.age} ${pet.ageUnit || "years"}`],
    ["Gender", pet.gender],
    ["Location", pet.location],
  ];

  context.font = "700 48px Arial, sans-serif";
  const nameLines = wrapCanvasText(context, pet.name, width - 270);
  context.font = "30px Arial, sans-serif";
  const wrappedRows = rows.map(([label, value]) => [
    label,
    wrapCanvasText(context, value, valueWidth),
  ]);

  const nameLineHeight = 60;
  const rowLineHeight = 40;
  const rowsTop = Math.max(315, 188 + nameLines.length * nameLineHeight + 35);
  const rowsHeight = wrappedRows.reduce(
    (height, [, lines]) => height + lines.length * rowLineHeight + 17,
    0,
  );
  const height = rowsTop + rowsHeight + 82;
  canvas.width = width;
  canvas.height = height;

  context.fillStyle = "#18211b";
  context.beginPath();
  context.roundRect(0, 0, width, height, 32);
  context.fill();
  context.strokeStyle = "#405c47";
  context.lineWidth = 3;
  context.stroke();

  context.fillStyle = "#a4d5ad";
  context.font = "800 27px Arial, sans-serif";
  context.fillText("pawfect", padding, 73);
  context.fillStyle = "#f08d70";
  context.fillText(".", padding + context.measureText("pawfect").width, 73);
  context.textAlign = "right";
  context.fillStyle = "#a0afa4";
  context.font = "700 21px Arial, sans-serif";
  context.fillText("PET IDENTIFICATION CARD", width - padding, 70);
  context.textAlign = "left";

  context.strokeStyle = "#405c47";
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(padding, 112);
  context.lineTo(width - padding, 112);
  context.stroke();

  context.fillStyle = "#26392d";
  context.beginPath();
  context.roundRect(padding, 158, 112, 112, 28);
  context.fill();
  if (petImage) {
    context.save();
    context.beginPath();
    context.roundRect(padding, 158, 112, 112, 28);
    context.clip();
    const scale = Math.max(112 / petImage.width, 112 / petImage.height);
    const imageWidth = petImage.width * scale;
    const imageHeight = petImage.height * scale;
    context.drawImage(
      petImage,
      padding + (112 - imageWidth) / 2,
      158 + (112 - imageHeight) / 2,
      imageWidth,
      imageHeight,
    );
    context.restore();
  } else {
    context.fillStyle = "#a0afa4";
    context.font = "700 17px Arial, sans-serif";
    context.textAlign = "center";
    context.fillText("No image", padding + 56, 220);
    context.textAlign = "left";
  }

  context.fillStyle = "#edf3ed";
  context.font = "700 48px Arial, sans-serif";
  nameLines.forEach((line, index) => {
    context.fillText(line, 210, 199 + index * nameLineHeight);
  });

  let rowY = rowsTop;
  wrappedRows.forEach(([label, lines]) => {
    context.fillStyle = "#a4d5ad";
    context.font = "700 25px Arial, sans-serif";
    context.fillText(`${label}:`, padding, rowY);
    context.fillStyle = "#c4d0c7";
    context.font = "30px Arial, sans-serif";
    lines.forEach((line, index) => {
      context.fillText(line, valueX, rowY + index * rowLineHeight);
    });
    rowY += lines.length * rowLineHeight + 17;
  });

  context.fillStyle = "#79b88a";
  context.font = "700 20px Arial, sans-serif";
  context.fillText("A new beginning starts with love.", padding, height - 34);

  return { canvas, imageIncluded: Boolean(petImage) };
};

const PetCard = () => {
  const { activePet } = useCardContext();
  const [downloadError, setDownloadError] = useState("");
  const [failedImageURL, setFailedImageURL] = useState("");
  const imageLoadFailed = activePet?.imageURL === failedImageURL;

  const handleDownload = async () => {
    if (!activePet) return;

    setDownloadError("");

    try {
      const { canvas, imageIncluded } = await createPetCardImage(activePet);
      if (activePet.imageURL && !imageIncluded) {
        setDownloadError("The pet image could not be added to the downloaded card. Check that the URL points to an image and allows cross-origin access.");
      }
      canvas.toBlob((blob) => {
        if (!blob) {
          setDownloadError("The pet card image could not be created. Please try again.");
          return;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${String(activePet.id).toLowerCase()}-pet-card.png`;
        link.click();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      }, "image/png");
    } catch (error) {
      setDownloadError(
        error instanceof Error
          ? error.message
          : "The pet card could not be downloaded. Please try again.",
      );
    }
  };

  return (
    <div className="card">
      <h2>Generated Pet ID Card</h2>
      {!activePet ? (
        <p className="placeholder">Fill out and submit the form to generate a Pet ID card.</p>
      ) : (
        <>
          <div className="pet-id-card">
            <div className="pet-icon">
              {activePet.imageURL && !imageLoadFailed ? (
                <img
                  src={activePet.imageURL}
                  alt={`${activePet.name}`}
                  onError={() => setFailedImageURL(activePet.imageURL)}
                />
              ) : (
                <span className="pet-image-placeholder">No image</span>
              )}
            </div>
            <div className="pet-card-body">
              <h2>{activePet.name}</h2>
              <p>
                <strong>Pet ID:</strong> {activePet.id}
              </p>
              <p>
                <strong>Species:</strong> {activePet.species}
              </p>
              <p>
                <strong>Breed:</strong> {activePet.breed}
              </p>
              <p>
                <strong>Age:</strong> {activePet.age} {activePet.ageUnit || "years"}
              </p>
              <p>
                <strong>Gender:</strong> {activePet.gender}
              </p>
              <p>
                <strong>Location:</strong> {activePet.location}
              </p>
            </div>
          </div>
          <button className="btn pet-card-download" onClick={handleDownload}>
            Download Pet ID Card
          </button>
          {downloadError && (
            <p className="error" role="alert">
              {downloadError}
            </p>
          )}
        </>
      )}
    </div>
  );
};
export default PetCard;
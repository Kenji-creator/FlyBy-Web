(() => {
  const config = window.FlyByOwner || {},
    photo = document.querySelector("#owner-photo");
  if (!photo || !config.photoUrl) return;
  photo.alt = config.photoAlt || "Rey M., owner and real estate media creator at FlyBy";
  photo.onload = () => {
    photo
      .closest(".owner-portrait")
      ?.style.setProperty(
        "--portrait-aspect",
        photo.naturalWidth + "/" + photo.naturalHeight,
      );
    photo.hidden = false;
    document.querySelector("#owner-portrait-placeholder").hidden = true;
  };
  photo.onerror = () => {
    photo.hidden = true;
    document.querySelector("#owner-portrait-placeholder").hidden = false;
  };
  photo.src = config.photoUrl;
})();

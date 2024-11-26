// Create folders

const showCreateFolderModal = document.getElementById(
  "open-createfolder-modal"
);

const createFolderModal = document.getElementById("create-folder-modal");

const hideCreateFolderModal = document.getElementById(
  "close-createfolder-modal"
);

if (
  showCreateFolderModal !== null &&
  hideCreateFolderModal !== null &&
  createFolderModal !== null
) {
  showCreateFolderModal.addEventListener("click", () => {
    createFolderModal.showModal();
  });

  hideCreateFolderModal.addEventListener("click", () => {
    createFolderModal.close();
  });
}

//Upload files

const showFileUploadModal = document.getElementById("open-fileupload-modal");

const fileUploadModal = document.getElementById("fileupload-modal");

const hideCreateFileUploadModal = document.getElementById(
  "close-fileupload-modal"
);

if (
  showFileUploadModal !== null &&
  fileUploadModal !== null &&
  hideCreateFolderModal !== null
) {
  showFileUploadModal.addEventListener("click", () => {
    fileUploadModal.showModal();
  });

  hideCreateFileUploadModal.addEventListener("click", () => {
    fileUploadModal.close();
  });
}

//Delete folders

const showShareFolderModal = document.getElementById("open-sharefolder-modal");

const shareFolderModal = document.getElementById("share-folder-modal");

const hideShareFolderModal = document.getElementById(
  "close-share-folder-modal"
);

console.log(showShareFolderModal, shareFolderModal, hideShareFolderModal);

if (
  showShareFolderModal !== null &&
  shareFolderModal !== null &&
  hideShareFolderModal !== null
) {
  showShareFolderModal.addEventListener("click", () => {
    shareFolderModal.showModal();
  });

  hideShareFolderModal.addEventListener("click", () => {
    shareFolderModal.close();
  });
}

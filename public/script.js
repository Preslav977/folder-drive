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

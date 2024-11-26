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

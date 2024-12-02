# folder-drive

![Screenshot_2024-12-02_10-14-28](https://github.com/user-attachments/assets/db29cf72-2bba-4425-a370-4ef2ba82b163)

# Overview

Folder Drive is a project that users can create, upload, and delete folders and files.

# About the project the project

The project is developed around Google Drive functionalities; basically, the user can CRUD folders and files and share them for a time.

# Live Preview

- [View the live site here](https://blog-api-frontend-lime.vercel.app/)

# Features

- Create folder, subfolder
- Upload file
- Delete folder with its content
- Share the folder with its content
- Download a file

# Technology Used

- Prisma: which is an ORM that represents data for databases used in OOP languages
- EJS: HTML extension used to render dynamic HTML content
- PassportJS: allow user to register and log in
- Prisma Session: allow the user to stay logged in for, for example, 1 day, until the session expires.

# Lessons Learned

- Learned what Prisma is and how to create different relationships between the models
- How to use the methods that Prisma supports: what works and what does not
- How to use Multer memory storage and upload buffer files utilizing Cloudinary to save the file there and get back the URL and save it in the database
- How to work with different Prisma methods and to include different objects related to it
- How to work with EJS partials to create modals
- That you can use DOM in EJS
- How to validate a file with express-validator
- How to render partials in the controllers
- How to share a folder with all its content and generate a random link that expires, which sends 404 after that

# Future Improvements

- Responsive design
- Live validation
- Accessibility
- How to validate more in-depth uploading a file
- How to render all folders no matter in which router the user is
- How to redirect to the log-in route when the session expires
- How can I render different modals on one route?
- Sharing file functionality
- How to make Cloudinary save file extensions for different files

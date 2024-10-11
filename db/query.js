const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getUserByUsername(username) {
    const user = await prisma.user.findUnique({
        where: {
            username: username,
        },
    });
    
    return user;
}

async function getUserById(id) {
    const user = await prisma.user.findUnique({
        where: {
            id: id,
        },
    });

    return user;
}

async function insertUser(firstName, lastName, username, password) {
    const user = await prisma.user.create({
        data: {
            firstname: firstName,
            lastname: lastName,
            username: username,
            password: password,
            folders: {
                create: {
                    name: 'Home',
                    homeFolder: true,
                }
            },
        },
        include: {
            folders: true,
        },
    });
}

async function getHomeFolder(userId) {
    const folder = await prisma.folder.findFirst({
        where: {
            ownerId: userId,
            homeFolder: true,
        }
    });
    return folder;
}

async function getChildrenFolders(folderId) {
    const folders = await prisma.folder.findMany({
        where: {
            parentFolderId: folderId,
        }
    });

    return folders;
}

async function getFolderFiles(folderId) {
    const files = await prisma.file.findMany({
        where: {
            folderId: folderId,
        }
    }); 

    return files;
}

async function getUserFolders(userId) {
    const folders = await prisma.folder.findMany({
        where: {
            ownerId: userId,
        },
    });
    return folders;
}

async function insertFile(name, size, fileURL, folderId) {
    const file = await prisma.file.create({
        data: {
            name: name,
            fileSize: size,
            fileURL: fileURL,
            folderId: folderId,
        },
    });
    console.log(file);
}

async function insertFolder(userId, name, parentFolderId) {
    const folder = await prisma.folder.create({
        data: {
            name: name,
            ownerId: userId,
            parentFolderId: parentFolderId,
        },
    });
    console.log(folder);
}

async function getFile(fileId) {
    const file = await prisma.file.findUnique({
        where: {
            id: fileId,
        }
    });
    return file;
}

async function updateFile(fileId, name, folderId) {
    const file = await prisma.file.update({
        where: {
            id: fileId,
        },
        data: {
            name: name,
            folderId: folderId,
        },
    });
    console.log(file);
}

async function deleteFile(fileId) {
    const deleteFile = await prisma.file.delete({
        where: {
            id: fileId,
        },
    });
    console.log(deleteFile);
}

async function getFolder(folderId) {
    const folder = await prisma.folder.findUnique({
        where: {
            id: folderId,
        },
    });
    return folder;
}

async function getOtherFolders(userId, folderId) {
    const folders = await prisma.folder.findMany({
        where: {
            ownerId: userId,
            id: {
                not: folderId,
            },
            OR: [
                { parentFolderId: { not: folderId }},
                { parentFolderId: null },
            ],
        },
    });
    return folders;
}

async function updateFolder(folderId, name, parentFolderId) {
    const folder = await prisma.folder.update({
        where: {
            id: folderId,
        },
        data: {
            name: name,
            parentFolderId: parentFolderId,
        },
    });

    console.log(folder);
}

async function deleteFolder(folderId) {
    const deleteFolder = await prisma.folder.delete({
        where: {
            id: folderId,
        },
    });
    console.log(deleteFolder);
}

module.exports = { 
    getUserByUsername, 
    getUserById, 
    insertUser,
    getHomeFolder,
    getChildrenFolders,
    getFolderFiles,
    getUserFolders,
    insertFile,
    insertFolder,
    getFile,
    updateFile,
    deleteFile,
    getFolder,
    getOtherFolders,
    updateFolder,
    deleteFolder,
};
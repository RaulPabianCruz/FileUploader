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

module.exports = { getUserByUsername, getUserById, insertUser };
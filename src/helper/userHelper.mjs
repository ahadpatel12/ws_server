// helper/userHelper.js
const users = [];
const room = [];

// Join user to chat
export function newRoom(id, username, room) {
    const room = { id, username, room };
    users.push(room);
    return room;
}

// Join user to chat
export function newUser(id, username, room) {
    const user = { id, username, room };

    users.push(user);

    return user;
}

// Get current user
export function getActiveUser(id) {
    return users.find(user => user.id === id);
}

// User leaves chat
export function exitRoom(id) {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

// Get room users
export function getIndividualRoomUsers(room) {
    return users.filter(user => user.room === room);
}

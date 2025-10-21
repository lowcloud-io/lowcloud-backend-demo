// Mock-Datenbank für Users
let users = [
    { id: 1, name: "Max Mustermann", email: "max@example.com" },
    { id: 2, name: "Anna Schmidt", email: "anna@example.com" },
];

let nextId = 3;

class UsersService {
    getAllUsers() {
        return users;
    }

    getUserById(id) {
        return users.find((user) => user.id === parseInt(id));
    }

    createUser(userData) {
        const newUser = {
            id: nextId++,
            name: userData.name,
            email: userData.email,
        };
        users.push(newUser);
        return newUser;
    }

    updateUser(id, userData) {
        const index = users.findIndex((user) => user.id === parseInt(id));
        if (index === -1) return null;

        users[index] = {
            ...users[index],
            ...userData,
            id: parseInt(id), // ID darf nicht überschrieben werden
        };
        return users[index];
    }

    deleteUser(id) {
        const index = users.findIndex((user) => user.id === parseInt(id));
        if (index === -1) return null;

        const deletedUser = users[index];
        users.splice(index, 1);
        return deletedUser;
    }
}

module.exports = new UsersService();

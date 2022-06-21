

module.exports = (client) => {
    console.log(`Logged in as ${client.user.username}`)
    client.editStatus({ name: `evils help`, type: 0 });
};
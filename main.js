var roomController = require('controller.room');

module.exports.loop = function ()
{
    let ownedRoomNames = Object.keys(Game.rooms);
    ownedRoomNames.forEach(roomName =>
    {
        console.log('ROOMS: ' + roomName)
        roomController.run(Game.rooms[roomName]);
    });
};
var roomController = require('controller.room');
 
module.exports.loop = function ()
{
    Memory.primaryLinks = 
    {
        'W8N3': {
            id: '104b0b455e4f255'
        }
    };

    let ownedRoomNames = Object.keys(Game.rooms);
    ownedRoomNames.forEach(roomName =>
    {
        //console.log('ROOM: ' + roomName)
        var room = Game.rooms[roomName];
        roomController.run(room);
    });
};

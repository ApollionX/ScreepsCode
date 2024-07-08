var roomController = require('controller.room');
 
module.exports.loop = function ()
{
    Memory.links = 
    {
        'W8N3': {
            pid: '104b0b455e4f255',
            sid: '55830b50afd3fd8'
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

var roomController = require('controller.room');
 
module.exports.loop = function ()
{
    Memory.links = 
    {
        'W8N3': {
            pid: '104b0b455e4f255',
            sid: '55830b50afd3fd8'
        },
        'W8N2': {
            pid: '09ee58b4ecdca88',
            sid: '09935740883ac4f'
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

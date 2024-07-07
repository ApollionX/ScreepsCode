var roomController = require('controller.room');
 
module.exports.loop = function ()
{
    let ownedRoomNames = Object.keys(Game.rooms);
    ownedRoomNames.forEach(roomName =>
    {
        //console.log('ROOM: ' + roomName)
        var room = Game.rooms[roomName];
        roomController.run(room);
    });
};

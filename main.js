var roomController = require('controller.room');
 
module.exports.loop = function ()
{
    Memory.links = 
    {
        'W8N3': 
        {
            name: 'First Room',
            pid: '55830b50afd3fd8',
            sid: '104b0b455e4f255',
            maxHarvesters: 3,
            maxBuilders: 0,
            maxHealers: 1,
            maxUpgraders: 2,
            maxExplorers: 1,
            harvesterBody: [WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
            builderBody: [WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
            healerBody: [WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE],
            upgraderBody: [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE],
            explorerBody: [WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CLAIM,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], 
            targetedHarvesting: false
        },
        'W8N2': 
        {
            name: 'Second Room',
            pid: '09935740883ac4f',
            sid: '09ee58b4ecdca88',
            maxHarvesters: 4,
            maxBuilders: 0,
            maxHealers: 1,
            maxUpgraders: 2,
            maxExplorers: 0,
            harvesterBody: [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
            builderBody: [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
            healerBody: [WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE],
            upgraderBody: [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE],
            explorerBody: [WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CLAIM,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], 
            targetedHarvesting: true
        },
        'W7N3': 
        {
            name: 'Third Room',
            pid: '',
            sid: '',
            maxHarvesters: 4,
            maxBuilders: 1,
            maxHealers: 0,
            maxUpgraders: 0,
            maxExplorers: 0,
            harvesterBody: '',
            builderBody: '',
            healerBody: '',
            upgraderBody: '',
            explorerBody: '', 
            targetedHarvesting: false
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

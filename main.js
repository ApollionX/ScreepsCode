var roomController = require('controller.room');
 
module.exports.loop = function ()
{
    Memory.links = 
    {
        'W8N3':
        {
            name: 'First Room',
            pid: '55830b50afd3fd8',
            sid: 'bdc60275c289c7a',
            maxHarvesters: 0,
            maxBuilders: 0,
            maxHealers: 1,
            maxUpgraders: 0,
            maxExplorers: 0,
            maxProducers: 2,
            maxConsumers: 2,
            harvesterBody: [WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
            builderBody: [WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
            healerBody: [WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE],
            upgraderBody: [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE],
            explorerBody: [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
            producerBody: [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE],
            consumerBody: [WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
            targetedHarvesting: true
        },
        'W8N2':
        {
            name: 'Second Room',
            pid: '09935740883ac4f',
            sid: 'a44b06a1ca3dde5',
            ps1: [6,12],
            ps2: [20,42],
            maxHarvesters: 4,
            maxBuilders: 2,
            maxHealers: 1,
            maxUpgraders: 0,
            maxExplorers: 0,
            maxProducers: 0,
            maxConsumers: 0,
            harvesterBody: [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
            builderBody: [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
            healerBody: [WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE],
            upgraderBody: [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE],
            explorerBody: [WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CLAIM,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
            producerBody: [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE],
            consumerBody: [WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
            targetedHarvesting: true
        },
        'W7N3':
        {
            name: 'Third Room',
            pid: '',
            sid: '',
            maxHarvesters: 4,
            maxBuilders: 0,
            maxHealers: 1,
            maxUpgraders: 0,
            maxExplorers: 0,
            maxProducers: 0,
            maxConsumers: 0,
            harvesterBody: [WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
            builderBody: [WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
            healerBody: [WORK,WORK,CARRY,CARRY,MOVE,MOVE],
            upgraderBody: [WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE],
            explorerBody: [WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE],
            producerBody: [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE],
            consumerBody: [WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
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

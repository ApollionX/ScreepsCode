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
            ssid: '',
            maxHarvesters: 0,
            maxBuilders: 0,
            maxHealers: 1,
            maxUpgraders: 1,
            maxExplorers: 0,
            maxProducers: 2,
            maxConsumers: 2,
            harvesterBody: [WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
            builderBody: [WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
            healerBody: [WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE],
            upgraderBody: [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE],
            explorerBody: [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
            producerBody: [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE],
            consumerBody: [WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
            targetedHarvesting: true
        },
        'W8N2':
        {
            name: 'Second Room',
            pid: '09935740883ac4f',
            sid: 'e4bc07377ce2cfa',
            ssid: 'a44b06a1ca3dde5',
            ps1: [6,12],
            ps2: [20,42],
            maxHarvesters: 0,
            maxBuilders: 0, 
            maxHealers: 1,
            maxUpgraders: 1,
            maxExplorers: 0,
            maxProducers: 2,
            maxConsumers: 2,
            harvesterBody: [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
            builderBody: [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
            healerBody: [WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE],
            upgraderBody: [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE],
            explorerBody: [WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CLAIM,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
            producerBody: [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE],
            consumerBody: [WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
            targetedHarvesting: true
        },
        'W7N3':
        {
            name: 'Third Room',
            pid: '8f03acc1e05de9d',
            sid: 'fa54ac4bb20c9e5',
            ssid: '2d4aac587b00b08',
            maxHarvesters: 0,
            maxBuilders: 0,
            maxHealers: 1,
            maxUpgraders: 1,
            maxExplorers: 0,
            maxProducers: 2,
            maxConsumers: 2,
            harvesterBody: [WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
            builderBody: [WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
            healerBody: [WORK,WORK,CARRY,CARRY,MOVE,MOVE],
            upgraderBody: [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE],
            explorerBody: [WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE],
            producerBody: [WORK,WORK,WORK,WORK,WORK,CARRY,MOVE],
            consumerBody: [WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],
            targetedHarvesting: true
        }
    };

    for (var name in Memory.creeps)
    {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    let ownedRoomNames = Object.keys(Game.rooms);
    ownedRoomNames.forEach(roomName =>
    {
        //console.log('ROOM: ' + roomName)
        var room = Game.rooms[roomName];
        roomController.run(room);
    });
};

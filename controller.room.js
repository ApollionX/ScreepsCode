var creepController = require('controller.creep');

var structureController = require('controller.structure');

var roomController = {

    /** @param {Room} room **/
    run: function(room) 
    {
        //console.log('Running room: ' + room);
        // This is where we do things once per room

        var spawns = room.find(FIND_MY_SPAWNS);
        // Check if we need more creeps
        if(room.controller.my && spawns[0] && spawns[0].progress == spawns[0].progressTotal)
            creepController.handleCreepSpawning(room);

        // Check if room needs to build anything
        //structureController.handleRoomBuilding(room);

        // Check if under attack
        this.handleAttackers(room);

        // Structure do work
        room.find(FIND_MY_STRUCTURES).forEach(structure => 
        {
            //structureController.run(structure);
        });

        // Creeps do work
        room.find(FIND_MY_CREEPS).forEach(creep => 
        {
            creepController.run(creep);
        });
    },
    handleAttackers: function(room)
    {
        const towers = room.find(FIND_MY_STRUCTURES, {filter: { structureType: STRUCTURE_TOWER }});
        towers.forEach(tower =>
        {
            structureController.singleTower(tower);
        });
    },
    makeRoadBetweenPoints: function(pos1, pos2)
    {
        let path = pos1.findPathTo(pos2, { ignoreCreeps: true });
        for (let i = 0; i < path.length; i++) 
        {
            let pos = new RoomPosition(path[i].x, path[i].y, pos1.roomName);
            pos.createConstructionSite(STRUCTURE_ROAD);
        }
    }
};

module.exports = roomController;

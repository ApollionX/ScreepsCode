var creepController = require('controller.creep');
var structureController = require('controller.structure');

var roomController = {

    /** @param {Room} room **/
    run: function(room) 
    {
        // This is where we do things once per room


        // Check if we need more creeps
        creepController.handleCreepSpawning(room);

        // Check if room needs to build anything
        structureController.handleRoomBuilding(room);

        // Check if under attack
        this.handleAttackers(room);

        // Structure do work
        for(let structure in room.find(FIND_MY_STRUCTURES)) 
        {
            structureController.run(structure);
        }

        // Creeps do work
        for(let creep in room.find(FIND_MY_CREEPS)) 
        {
            creepController.run(creep);
        }
    },
    handleAttackers: function(room)
    {

    }
};

module.exports = structureController;
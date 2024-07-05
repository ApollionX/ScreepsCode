var builder = require('proto.builder');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var conSites = creep.room.find(FIND_CONSTRUCTION_SITES);
        
        builder.checkAndBuildEnergyStorage(creep);
        builder.checkAndBuildContiners(creep);
        
        
	    if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
	        creep.memory.building = true;
	        creep.say('🚧 build');
	    }

	    if(creep.memory.building) {
            if(conSites.length) {
                if(creep.build(conSites[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(conSites[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
	    }
	    else {
	        var source = creep.pos.findClosestByPath(creep.room.find(FIND_SOURCES));
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
	    }
	}
};

module.exports = roleBuilder;
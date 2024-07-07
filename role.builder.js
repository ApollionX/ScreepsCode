var builder = require('proto.builder');
var globals = require('globals');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var conSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        
        
	    if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            //creep.say('🔄 harvest');
	    }
	    if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
	        creep.memory.building = true;
	        //creep.say('🚧 build');
	    }

	    if(creep.memory.building) {
            if(conSite) {
                if(creep.build(conSite) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(conSite, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
	    }
	    else
	    {
	        globals.mineClosestNode(creep);
	    }
	}
};

module.exports = roleBuilder;
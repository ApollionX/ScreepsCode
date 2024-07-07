var globals = require('globals');
const makeRoads = false;

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.memory.isFilling)
        {
            globals.mineClosestNode(creep);
            if(creep.store.getFreeCapacity() == 0)
                creep.memory.isFilling = false;
        }
        else {
            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
            });

            if (!target)
            {
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_TOWER) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                });
            }
            
            if(target) {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else
            {
                //creep.say('NO TARGETS');
                var conSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                if(conSite) 
                {
                    if(creep.build(conSite) == ERR_NOT_IN_RANGE)
                    {
                        creep.moveTo(conSite, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            }
            
            if(creep.store.getUsedCapacity() == 0)
                creep.memory.isFilling = true;
            
            // drop road everywhere you go
            if (makeRoads)
            {
                creep.room.createConstructionSite(creep.pos, STRUCTURE_ROAD);
            }
        }
	}
};

module.exports = roleHarvester;
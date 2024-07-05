const globals = 
{
    getEnergyFromContainer: function(creep) 
    {  
        var containerWithEnergy = creep.room.find(FIND_STRUCTURES, 
            {
                filter: (structure) => {return structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 0;}
            })[0];
            
        if(creep.withdraw(containerWithEnergy, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(containerWithEnergy, {visualizePathStyle: {stroke: '#ffaa00'}});
        }
    }
};

module.exports = globals;
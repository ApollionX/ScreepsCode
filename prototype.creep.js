Creep.prototype.mineClosestEnergy = function() 
{
    let closestSourceWithEnegry = this.pos.findClosestByPath(
        FIND_SOURCES_ACTIVE, 
        {filter: (source) => source.energy > 0}
        );

    // optimize, can move then harvest
    this.moveToTarget(closestSourceWithEnegry.pos);
    this.harvest(closestSourceWithEnegry);
};

Creep.prototype.getEnergyFromContainer = function() 
{  
    let containerWithEnergy = this.room.find(
            FIND_STRUCTURES, 
            {filter: (structure) => {return structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 0;}}
        )[0];
        
    this.moveToTarget(containerWithEnergy.pos);
    this.withdraw(containerWithEnergy, RESOURCE_ENERGY);
};

Creep.prototype.moveToTarget = function (pos)
{
    let distance = this.pos.getRangeTo(pos);
    this.say("Dst: " + distance);
    this.moveTo(pos, {visualizePathStyle: {stroke: '#ffaa00'}});
};

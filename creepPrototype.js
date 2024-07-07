Creep.prototype.mineClosestEnergy = function() 
{
    let closestSourceWithEnegry = this.pos.findClosestByPath(FIND_SOURCES_ACTIVE, {
        filter: (source) => source.energy > 0
    });

    // optimize, can move then harvest
    let distance = this.pos.getRangeTo(closestSourceWithEnegry.x, closestSourceWithEnegry.y);
    this.say("Dst: " + distance);
    if(this.harvest(closestSourceWithEnegry) == ERR_NOT_IN_RANGE) 
    {
        this.moveTo(closestSourceWithEnegry, {visualizePathStyle: {stroke: '#ffaa00'}});
    }
};

Creep.prototype.getEnergyFromContainer = function() 
{  
    var containerWithEnergy = this.room.find(FIND_STRUCTURES, 
        {
            filter: (structure) => {return structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 0;}
        })[0];
        
    if(this.withdraw(containerWithEnergy, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        this.moveTo(containerWithEnergy, {visualizePathStyle: {stroke: '#ffaa00'}});
    }
};

Creep.prototype.moveToTarget = function (pos)
{
    this.moveTo(pos);
};
Creep.prototype.mineClosestEnergy = function() 
{
    let closestSourceWithEnergy;

    // If we have a stored target
    if (this.memory.harvestTarget)
        closestSourceWithEnergy = Game.getObjectById(this.memory.harvestTarget);

    // if stored target is empty
    if (closestSourceWithEnergy && closestSourceWithEnergy.energy == 0)
        closestSourceWithEnergy = null;

    // No target, find closest available
    if (!closestSourceWithEnergy)
        closestSourceWithEnergy = this.pos.findClosestByPath(
            FIND_SOURCES_ACTIVE, 
            {filter: (source) => source.energy > 0}
            );
        
    // No sources at all, return false
    if (!closestSourceWithEnergy)
        return false;

    this.moveToTarget(closestSourceWithEnergy.pos);
    this.harvest(closestSourceWithEnergy);
    this.say('⚡');
    return true;
};

Creep.prototype.mineClosestEnergyToTarget = function(pos) 
{
    let closestSourceWithEnergy = pos.findClosestByPath(
        FIND_SOURCES_ACTIVE, 
        {filter: (source) => source.energy > 0}
        );
        
    if (!closestSourceWithEnergy)
        return false;

    // optimize, can move then harvest
    this.moveToTarget(closestSourceWithEnergy.pos);
    this.harvest(closestSourceWithEnergy);
    this.say('🎂');
    return true;
};

Creep.prototype.getEnergyFromContainer = function() 
{  
    let containersWithEnergy = this.room.find
    (
        FIND_STRUCTURES, 
        {filter: (structure) => {return structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 0;}}
    );
    if(containersWithEnergy.length > 0)
    {
        let containerWithEnergy = containersWithEnergy[0]; 
        this.moveToTarget(containerWithEnergy.pos);
        this.withdraw(containerWithEnergy, RESOURCE_ENERGY);
        this.say('🎁');
        return true;
    }
    else
    {
        return false;
    }
};

Creep.prototype.getEnergyFromLink = function()
{
    if (!Memory.links[this.room.name])
        return false;

    let containerWithEnergy = Game.getObjectById(Memory.links[this.room.name].sid);
    if(containerWithEnergy)
    {
        this.moveToTarget(containerWithEnergy.pos);
        this.withdraw(containerWithEnergy, RESOURCE_ENERGY);
        this.say('🎁');
        return true;
    }
    else
    {
        return false;
    }
};

Creep.prototype.moveToTarget = function (target)
{
    let distance = this.pos.getRangeTo(target);
    let optimizeValue = 2;  // Higher the more optimal, slower to react, 0 most optimal HIGHEST CPU (Default: 5)

    if(distance > 1)
        this.moveTo(target, {reusePath: optimizeValue, visualizePathStyle: {stroke: '#ff0000', opacity:1}});
};

Creep.prototype.moveWithinRangeTarget = function (target, range)
{
    let distance = this.pos.getRangeTo(target);
    let optimizeValue = 2;  // Higher the more optimal, slower to react, 0 most optimal HIGHEST CPU (Default: 5)

    if(distance > range)
    {
        this.moveTo(target, {reusePath: optimizeValue, visualizePathStyle: {stroke: '#ff0000', opacity:1}});
        return true;
    }

    return false;
};

Creep.prototype.tryDumpEnergy = function()
{
     var target = this.pos.findClosestByPath
     (
        FIND_STRUCTURES, 
        { 
            filter: (structure) => 
            { return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
              structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        }
    );
    
    if (!target)
    {
        target = this.pos.findClosestByPath
        (
            FIND_STRUCTURES,
            {
                filter: (structure) => 
                { return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_TOWER || structure.structureType == STRUCTURE_LINK) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0 && structure.progress == structure.progressTotal;
                }
            }
        );
    }

    if(target)
    {
        this.moveToTarget(target);
        this.transfer(target, RESOURCE_ENERGY);
        this.say('🥟');
    }

    return target;
};

Creep.prototype.tryBuildStructure = function()
{
    var conSite = this.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
    if(conSite) 
    {
        this.moveToTarget(conSite);
        this.build(conSite);
        this.say('👩‍🚒');
    }

    return conSite;
};

Creep.prototype.moveAndUpgradeController = function()
{
    var roomCtl = this.room.controller;
    this.moveWithinRangeTarget(roomCtl.pos, 3);
    this.upgradeController(roomCtl);
    this.say('⛲');
};

Creep.prototype.shouldFill = function()
{
    if(this.memory.filling)
    {
        if(this.store.getFreeCapacity() == 0)
            this.memory.filling = false;
    }
    else
    {
        if(this.store.getUsedCapacity() == 0)
            this.memory.filling = true;
    }

    return this.memory.filling;
};

Creep.prototype.moveToAndRepair = function(patient)
{
    this.moveToTarget(patient.pos);
    this.repair(patient);
};

Creep.prototype.tryAndRepairSomething = function()
{
    if (!this.memory.patient)
    {
        const targets = this.room.find(FIND_STRUCTURES);
        targets.sort((a,b) => (b.hitsMax - b.hits) - (a.hitsMax - a.hits));
        this.memory.patient = targets[0].id;
    }

    if(this.memory.patient)
    {
        var patient = Game.getObjectById(this.memory.patient);
        this.say('❤');
        
        if (!patient)
        {
            this.memory.patient=null;
        }
        else
        {
            // Heal patient
            this.moveToAndRepair(patient);
            
            if(patient.hits == patient.hitsMax)
            {
                this.memory.patient=null;
            }
        }
    }

    return this.memory.patient
};

Creep.prototype.claimRoom = function()
{
    var controller = this.room.controller;
    this.moveToTarget(controller.pos);
    this.reserveController(controller);
    this.claimController(controller);
};
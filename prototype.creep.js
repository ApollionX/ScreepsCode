Creep.prototype.mineClosestEnergy = function() 
{
    let closestSourceWithEnegry = this.pos.findClosestByPath(
        FIND_SOURCES_ACTIVE, 
        {filter: (source) => source.energy > 0}
        );
        
    if (!closestSourceWithEnegry)
        return false;

    // optimize, can move then harvest
    this.moveToTarget(closestSourceWithEnegry.pos);
    this.harvest(closestSourceWithEnegry);
    return true;
};

Creep.prototype.getEnergyFromContainer = function() 
{  
    let containerWithEnergy = this.room.find
    (
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
                { return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_TOWER) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            }
        );
    }
                
    if(target)
    {
        this.moveToTarget(target);
        this.transfer(target, RESOURCE_ENERGY);
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
    }

    return conSite;
};

Creep.prototype.moveAndUpgradeController = function()
{
    var roomCtl = this.room.controller;
    this.moveToTarget(roomCtl.pos);
    this.upgradeController(roomCtl);
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
    const targets = this.room.find(FIND_STRUCTURES);
    targets.sort((a,b) => (b.hitsMax - b.hits) - (a.hitsMax - a.hits));
    this.memory.patient = targets[0].id;

    if(this.memory.patient)
    {
        var patient = Game.getObjectById(this.memory.patient);
        //this.say('❤  Healing' + patient.structureType);
        
        if (this.memory.patient == null)
        {
            this.memory.patient=null;
        }
        else
        {
            // Heal patient
            console.log('Heading to: ' + patient);
            this.moveToAndRepair(patient);
            
            if(patient.hits == patient.hitsMax)
            {
                const targets = this.room.find(FIND_STRUCTURES);
                targets.sort((a,b) => (b.hitsMax - b.hits) - (a.hitsMax - a.hits));
                this.memory.patient = targets[0].id;
            }
        }
    }

    return this.memory.patient
};
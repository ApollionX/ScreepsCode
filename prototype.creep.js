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

Creep.prototype.stationaryMining = function()
{
    let source = Game.getObjectById(this.memory.harvestTarget);
    let link = Game.getObjectById(Memory.links[this.room.name].sid);
    let link2 = Game.getObjectById(Memory.links[this.room.name].ssid);

    this.harvest(source);
    this.transfer(link, RESOURCE_ENERGY);
    this.transfer(link2, RESOURCE_ENERGY);
    this.say('👲');
};

Creep.prototype.moveToProducerSpot = function()
{
    if (!this.memory.standingSpot)
    {
        const source = Game.getObjectById(this.memory.harvestTarget);
        const links = this.room.find
        (
            FIND_STRUCTURES,
            {
                filter: (structure) => 
                { return structure.structureType == STRUCTURE_LINK; }
            }
        );

        //console.log(source + links);
        for (let x = -1; x < 2; ++x)
        {
            for(let y = -1; y < 2; ++y)
            {
                if (x==0 && y == 0)
                    continue;
                else
                {
                    const check = new RoomPosition(source.pos.x + x, source.pos.y + y, source.pos.roomName);

                    for (let i = 0; i < links.length; ++i)
                    {
                        if (check.inRangeTo(source.pos, 1) && check.inRangeTo(links[i], 1))
                        {
                            this.memory.standingSpot = check;
                            
                            return true;
                        }
                    }
                }
            }
        }

        return true;
    }
    else
    {
        let target = new RoomPosition(this.memory.standingSpot.x, this.memory.standingSpot.y, this.memory.standingSpot.roomName);
        let result = !this.standOnTarget(target);
        return result;
    }
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
        this.say('🔌');
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

    let containerWithEnergy = Game.getObjectById(Memory.links[this.room.name].pid);
    if(containerWithEnergy)
    {
        this.moveToTarget(containerWithEnergy.pos);
        this.withdraw(containerWithEnergy, RESOURCE_ENERGY);
        this.say('🔌');
        return true;
    }
    else
    {
        return false;
    }
};

Creep.prototype.moveToTarget = function (target)
{
    if (!target)
        return;

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

Creep.prototype.standOnTarget = function (target)
{
    let distance = this.pos.getRangeTo(target);
    let optimizeValue = 2;  // Higher the more optimal, slower to react, 0 most optimal HIGHEST CPU (Default: 5)

    if(target.x != this.pos.x || target.y != this.pos.y)
    {
        this.moveTo(target, {reusePath: optimizeValue, visualizePathStyle: {stroke: '#ff0000', opacity:1}});
        return false;
    }

    return true;
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
        this.say('🌞');
    }

    return target;
};

Creep.prototype.tryDumpEnergyExtension = function()
{
    var target = this.pos.findClosestByPath
    (
       FIND_STRUCTURES, 
       { 
           filter: (structure) => 
           { return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_TOWER) &&
             structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
           }
       }
   );

   if(target)
    {
        this.moveToTarget(target);
        this.transfer(target, RESOURCE_ENERGY);
        this.say('🌞');
        return true;
    }

    return false;
};

Creep.prototype.tryBuildStructure = function()
{
    var conSite = this.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
    if(conSite) 
    {
        this.moveWithinRangeTarget(conSite, 2);
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

Creep.prototype.attackArea = function(pos)
{
    var target = pos.findClosestByPath(FIND_HOSTILE_CREEPS || FIND_HOSTILE_STRUCTURES || FIND_HOSTILE_SPAWNS);
    this.moveToTarget(target);
    this.attack(target);
};

Creep.prototype.claimRoom = function()
{
    var controller = this.room.controller;
    this.moveToTarget(controller.pos);
    this.reserveController(controller);
    this.claimController(controller);
};
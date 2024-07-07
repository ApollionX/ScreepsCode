var structureController = {

    /** @param {Room} room **/
    run: function(room)
    {
    },
    handleRoomBuilding: function(room)
    {   
    },
    singleTower: function(tower) 
    {  
        if (tower == null)
            return;
        const hostiles = tower.room.find(FIND_HOSTILE_CREEPS);
        const target = tower.pos.findClosestByRange(hostiles);
        tower.attack(target);
    },
    checkAndBuildEnergyStorage: function(creep) 
    {  
        //Check if we need to spawn more energy
        var conSites = creep.room.find(FIND_CONSTRUCTION_SITES);
        const bases = creep.room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_SPAWN }
            });
        const extensions = creep.room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_EXTENSION }
            });
        const base = bases[0];
        //console.log('Extensions: ' + extensions.length + ', ConSites: ' + conSites.length);
            
        if(extensions.length < 0 && conSites.length < 1 && base)
        {
            const buildSpots = creep.room.lookForAtArea(LOOK_TERRAIN, base.pos.y - 2, base.pos.x - 2, base.pos.y, base.pos.x + 2, true);
            //console.log(buildSpots);
            for (var i = 0; i < buildSpots.length; i++)
            {
                if (creep.room.createConstructionSite(buildSpots[i].x,buildSpots[i].y,STRUCTURE_EXTENSION) == OK)
                {
                    console.log('Building at: ' + buildSpots[i].x + ', ' + buildSpots[i].y);
                    break;
                }
                //console.log('check: ' + i);
            }
        }
    },
    checkAndBuildContiners: function(creep) 
    {  
        //Check if we need to spawn more energy
        var conSites = creep.room.find(FIND_CONSTRUCTION_SITES);
        const bases = creep.room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_SPAWN }
            });
        const containers = creep.room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_CONTAINER }
            });
        const base = bases[0];
        //console.log('Containers: ' + containers.length + ', ConSites: ' + conSites.length);
            
        if(containers.length < 0 && conSites.length < 1 && base)
        {
            const buildSpots = creep.room.lookForAtArea(LOOK_TERRAIN, base.pos.y - 2, base.pos.x - 2, base.pos.y, base.pos.x + 2, true);
            //console.log(buildSpots);
            for (var i = 0; i < buildSpots.length; i++)
            {
                if (creep.room.createConstructionSite(buildSpots[i].x,buildSpots[i].y,STRUCTURE_CONTAINER) == OK)
                {
                    console.log('Building at: ' + buildSpots[i].x + ', ' + buildSpots[i].y);
                    break;
                }
                //console.log('check: ' + i);
            }
        }
    }
};

module.exports = structureController;

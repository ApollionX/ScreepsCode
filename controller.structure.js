var structureController = {

    /** @param {Room} room **/
    run: function(room)
    {
    },
    handleLinkTransfers: function(room)
    {
        if (Memory.links[room.name])
        {
            let linkP = Game.getObjectById(Memory.links[room.name].pid);
            let linkS = Game.getObjectById(Memory.links[room.name].sid);
            let linkSS = Game.getObjectById(Memory.links[room.name].ssid);

            if (linkP && linkS)
            {
                linkS.transferEnergy(linkP);
            }

            if (linkP && linkSS)
            {
                linkSS.transferEnergy(linkP);
            }
        }
    },
    handleRoomBuilding: function(room)
    {  
        if (room.name == 'W8N2')
        {
            //this.makeRoadBetweenPoints(room.)
            const bases = room.find(FIND_MY_STRUCTURES, {
                filter: { structureType: STRUCTURE_SPAWN }
                });
            const sources = room.find(FIND_SOURCES_ACTIVE);
            
            //this.makeRoadBetweenPoints(bases[0].pos, room.controller);
        }
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
    },
    makeRoadBetweenPoints: function(pos1, pos2)
    {
        let path = pos1.findPathTo(pos2, { ignoreCreeps: true });
        for (let i = 0; i < path.length; i++) 
        {
            let pos = new RoomPosition(path[i].x, path[i].y, pos1.roomName);
            pos.createConstructionSite(STRUCTURE_ROAD);
        }
    }
};

module.exports = structureController;

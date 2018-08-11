package com.luoamin.service.train;

import com.luoamin.domain.train.RailwayStation;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service("RailwayStationService")
public class RailwayStationServiceImpl implements RailwayStationService {
    
    private static List<RailwayStation> rsList = new ArrayList<RailwayStation>();
    private static Long id = 0L;

    public RailwayStation getRailwayStationById(Long id) {
    	
    	return findRailwayStationById(id);
    }

    private RailwayStation findRailwayStationById(Long id) {
        for (RailwayStation rs : rsList) {
            if (rs.getId() == id) {
                return rs;
            }
        }

        return null;
    }

	public List<RailwayStation> getAllRailwayStations() {
		return rsList;
	}


	public void addRailwayStation(RailwayStation railwayStation) {
		railwayStation.setId(++ id);
		rsList.add(railwayStation);		
		
	}

	public void deleteRailwayStationById(Long id) {
        RailwayStation found = findRailwayStationById(id);
        if (found != null) {
            rsList.remove(found);
            id--;
        }
		
	}

	public void updateRailwayStation(RailwayStation railwayStation) {
        RailwayStation found = findRailwayStationById(railwayStation.getId());
        if (found != null) {
            rsList.remove(found);
            rsList.add(railwayStation);
        }
	}
	
    @Override
    public void deleteAll() {
        rsList.clear();
        id = 0L;
    }
}

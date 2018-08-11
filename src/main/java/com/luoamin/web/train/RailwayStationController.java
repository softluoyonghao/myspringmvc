package com.luoamin.web.train;

import com.luoamin.domain.train.RailwayStation;
import com.luoamin.service.train.RailwayStationServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/railwaystations")
public class RailwayStationController {

    @Autowired
    private RailwayStationServiceImpl railwayStationsService;

    @RequestMapping("railwaystationlist.json")
    public @ResponseBody
    List<RailwayStation> getRailwayStationList() {
        return railwayStationsService.getAllRailwayStations();
    }

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    public @ResponseBody
    void addRailwayStation(@RequestBody RailwayStation railwayStation) {
        railwayStationsService.addRailwayStation(railwayStation);
    }

    @RequestMapping(value = "/update", method = RequestMethod.PUT)
    public @ResponseBody
    void updateRailwayStation(@RequestBody RailwayStation railwayStation) {
        railwayStationsService.updateRailwayStation(railwayStation);
    }

    @RequestMapping(value = "/remove/{id}", method = RequestMethod.DELETE)
    public @ResponseBody
    void removeRailwayStation(@PathVariable("id") Long id) {
        railwayStationsService.deleteRailwayStationById(id);
    }

    @RequestMapping(value = "/removeAll", method = RequestMethod.DELETE)
    public @ResponseBody
    void removeAllRailwayStations() {
        railwayStationsService.deleteAll();
    }

    @RequestMapping("/layout")
    public String getRailwayStationPartialPage(ModelMap modelMap) {
        return "railwaystations/layout";
    }
}

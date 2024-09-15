package com.travel.impl.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import com.travel.api.TravelApi;
import com.travel.impl.services.TravelService;
import com.travel.impl.services.UserService;
import com.travel.model.Travel;
import com.travel.model.User;

@RestController
public class TravelController implements TravelApi {

    private static Logger log = LoggerFactory.getLogger(TravelController.class);

    @Autowired
    private TravelService travelService;

    @Autowired
    private UserService userService;

    @Override
    public ResponseEntity<List<Travel>> getAllTravel() {
        return new ResponseEntity<>(travelService.getAllTravel(), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<Travel> upsertTravelRecord(Travel travel) {
        return new ResponseEntity<>(travelService.createTravel(travel), HttpStatus.OK);
    }

    @Override
    public ResponseEntity<List<Travel>> getUserTravel(Long userId) {
        if(userService.getUserById(userId) != null) {
            return new ResponseEntity<>(travelService.getAllTravelOfUser(new User().id(userId)), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}

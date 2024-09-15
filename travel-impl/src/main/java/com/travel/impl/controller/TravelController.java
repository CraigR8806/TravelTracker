package com.travel.impl.controller;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RestController;

import com.travel.api.TravelApi;
import com.travel.impl.services.TravelService;
import com.travel.model.Travel;
import com.travel.model.User;

@RestController
public class TravelController implements TravelApi {

    private static Logger log = LoggerFactory.getLogger(TravelController.class);

    @Autowired
    private TravelService travelService;

    @Override
    public ResponseEntity<List<Travel>> getAllTravel() {
        if(SecurityContextHolder.getContext().getAuthentication() != null) {
            User loggedInUser = (User)SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        
            log.info(loggedInUser.getUsername());
            return new ResponseEntity<>(travelService.getAllTravelOfUser(loggedInUser), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.OK);
        }
    }

    @Override
    public ResponseEntity<Travel> upsertTravelRecord(Travel travel) {
        return new ResponseEntity<>(travelService.createTravel(travel), HttpStatus.OK);
    }

}

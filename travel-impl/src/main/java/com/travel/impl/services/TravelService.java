package com.travel.impl.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.travel.model.Travel;
import com.travel.model.User;

@Service
public interface TravelService {

    public List<Travel> getAllTravel();

    public List<Travel> getAllTravelOfUser(User user);

    public void modifyTravel(Travel travel);

    public void deleteTravel(Travel travel);

    public Travel createTravel(Travel travel);

    public Travel getTravelById(long id);
}

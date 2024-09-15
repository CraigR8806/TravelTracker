package com.travel.impl.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.travel.impl.dao.travel.TravelRepository;
import com.travel.model.Travel;
import com.travel.model.User;

@Service
public class TravelServiceImpl implements TravelService {

    @Autowired
    private TravelRepository travelRepository;

    @Override
    public List<Travel> getAllTravel() {
        return travelRepository.findAll();
    }

    @Override
    public List<Travel> getAllTravelOfUser(User user) {
        return travelRepository.findAllTravelByUser(user);
    }

    @Override
    public void modifyTravel(Travel travel) {
       travelRepository.save(travel);
    }

    @Override
    public void deleteTravel(Travel travel) {
       travelRepository.delete(travel);
    }

    @Override
    public Travel createTravel(Travel travel) {
        return travelRepository.save(travel);
    }

    @Override
    public Travel getTravelById(long id) {
        Optional<Travel> out = travelRepository.findById(id);

        if(out.isPresent()){
            return out.get();
        }

        return null;
    }


}

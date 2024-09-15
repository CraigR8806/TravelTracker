package com.travel.impl.dao.travel;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.travel.model.Travel;
import com.travel.model.User;

import org.springframework.data.domain.Example;

public interface TravelRepository extends JpaRepository<Travel, Long>{

    default List<Travel> findAllTravelByUser(User user) {

        Travel travelExample = new Travel();
        travelExample.setUser(user);

        Example<Travel> example = Example.of(travelExample);

        return findAll(example);
    }

}

package com.travel.impl.dao.user;

import java.util.Optional;

import org.springframework.data.domain.Example;
import org.springframework.data.jpa.repository.JpaRepository;

import com.travel.model.User;


public interface UserRepository extends JpaRepository<User, Long> {

    default User findByUsername(String username) {

        User userExample = new User().username(username);

        Example<User> example = Example.of(userExample);

        User out = null;
        Optional<User> userOptional = findOne(example);
        if(userOptional.isPresent()){
            out = userOptional.get();
        }

        return out;
    }

    default User findByEmail(String email) {
        User userExample = new User().email(email);

        Example<User> example = Example.of(userExample);

        User out = null;
        Optional<User> userOptional = findOne(example);
        if(userOptional.isPresent()){
            out = userOptional.get();
        }

        return out;
    }

    default User findByApiKey(String apiKey) {
        User userExample = new User().activeApiKey(apiKey);

        Example<User> example = Example.of(userExample);

        User out = null;
        Optional<User> userOptional = findOne(example);
        if(userOptional.isPresent()){
            out = userOptional.get();
        }

        return out;
    }

}

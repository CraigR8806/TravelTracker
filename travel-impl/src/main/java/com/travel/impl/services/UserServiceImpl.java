package com.travel.impl.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.travel.impl.dao.user.UserRepository;
import com.travel.impl.utils.ApiKeyUtil;
import com.travel.impl.utils.DateUtil;
import com.travel.impl.utils.PasswordUtil;
import com.travel.model.ApiKeyResponse;
import com.travel.model.User;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(long id) {
        Optional<User> out = userRepository.findById(id);

        if(out.isPresent()){
            return out.get();
        }

        return null;
    }

    @Override
    public void deleteUser(User user) {
       userRepository.delete(user);
    }

    @Override
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public boolean verifyUsernameUnique(String username){ 
        return userRepository.findByUsername(username) == null;
    }

    @Override
    public boolean verifyEmailUnique(String email) {
        return userRepository.findByEmail(email) == null;
    }

    @Override
    public User getByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public ApiKeyResponse login(User user) {
        User fullUser = userRepository.findByUsername(user.getUsername());

        if(fullUser == null) {
            return null;
        }

        if(PasswordUtil.validatePassword(user.getPassword(), fullUser.getPassword())) {
            
            ApiKeyResponse apiKeyContainer = ApiKeyUtil.generateNewApiKeyContainer();

            fullUser.activeApiKey(apiKeyContainer.getApiKey());
            fullUser.apiKeyExpires(apiKeyContainer.getApiKeyExpiration());
            fullUser.apiKeyRefreshExpiration(apiKeyContainer.getApiKeyRefreshExpiration());

            userRepository.save(fullUser);

            return apiKeyContainer;
        } else {
            return null;
        }
    }

    @Override
    public ApiKeyResponse refreshApiKey() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if(user == null) {
            return null;
        }
        if(!DateUtil.dateTimeIsPast(user.getApiKeyExpires())) {
            return null;
        }
        ApiKeyResponse out = ApiKeyUtil.generateNewApiKeyContainer();
        user.activeApiKey(out.getApiKey())
            .apiKeyExpires(out.getApiKeyExpiration())
            .apiKeyRefreshExpiration(out.getApiKeyRefreshExpiration());

        userRepository.save(user);

        return out;
    }

    @Override
    public User getUserByApiKey(String apiKey) {
        User potentialUser = userRepository.findByApiKey(apiKey);

        if(!ApiKeyUtil.apiKeyIsValid(potentialUser)) {
            return null;
        } else {
            return potentialUser;
        }
    }



}

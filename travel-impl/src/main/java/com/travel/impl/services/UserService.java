package com.travel.impl.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.travel.model.ApiKeyResponse;
import com.travel.model.User;

@Service
public interface UserService {

    public List<User> getAllUsers();

    public User getUserById(long id);
    
    public void deleteUser(User user);

    public User saveUser(User user);

    public boolean verifyUsernameUnique(String username);

    public boolean verifyEmailUnique(String email);

    public User getByUsername(String username);

    public ApiKeyResponse login(User user);

    public ApiKeyResponse refreshApiKey();

    public User getUserByApiKey(String apiKey);
    
}

package com.travel.impl.controller;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.travel.api.UserApi;
import com.travel.impl.services.UserService;
import com.travel.impl.utils.PasswordUtil;
import com.travel.model.ApiKeyResponse;
import com.travel.model.User;


@RestController
public class UserController implements UserApi {

   private static final Logger log = LoggerFactory.getLogger(UserController.class);


   @Autowired
   private UserService userService;


   @Override
   public ResponseEntity<List<User>> getAllUsers() {
      List<User> out = new ArrayList<>();
      User user = (User)SecurityContextHolder.getContext().getAuthentication().getPrincipal();
      log.info("Authenticated User: " + user.getUsername());
      userService.getAllUsers().forEach(out::add);
      return new ResponseEntity<List<User>>(out, HttpStatus.OK);
   }

   @Override
   public ResponseEntity<User> upsertUser(@RequestBody User user) {
      if(!userService.verifyUsernameUnique(user.getUsername()) || 
         !userService.verifyEmailUnique(user.getEmail())) {
         return new ResponseEntity<>(HttpStatus.CONFLICT);
      }
      
      String hashedPassword = PasswordUtil.generateStorngPasswordHash(user.getPassword());

      if(hashedPassword == null) {
         log.error("Problems hashing password...");
         return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
      }

      user.setPassword(hashedPassword);
      

      return new ResponseEntity<>(userService.saveUser(user), HttpStatus.OK);
   }

   @Override
   public ResponseEntity<ApiKeyResponse> login(User user) {
      ApiKeyResponse out = userService.login(user);
      if(out == null) {
         return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
      }
      return new ResponseEntity<>(out, HttpStatus.OK);
   }

   @Override
   public ResponseEntity<ApiKeyResponse> refreshToken() {
      ApiKeyResponse out = userService.refreshApiKey();
      if(out == null) {
         return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
      }

      return new ResponseEntity<>(out, HttpStatus.OK);
   }



}

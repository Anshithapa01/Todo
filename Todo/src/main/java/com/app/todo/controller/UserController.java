package com.app.todo.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.todo.exception.UserException;
import com.app.todo.model.User;
import com.app.todo.request.UpdateUserRequest;
import com.app.todo.service.UserService;

@RestController
@RequestMapping("/api")
public class UserController {

	@Autowired
	private UserService userService;
	
	@GetMapping("/all")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }
	
	@GetMapping("/profile")
	public ResponseEntity<User>getStudentProfileHandler(@RequestHeader("Authorization")String jwt)throws UserException{
		User user=userService.findUserProfileByJwt(jwt);
		return new ResponseEntity<User>(user,HttpStatus.ACCEPTED);
	}
	
	@PutMapping("/profile")
	public ResponseEntity<User> updateUserProfile(
	    @RequestBody UpdateUserRequest updatedUser, 
	    @RequestHeader("Authorization") String token) throws UserException {
	    System.out.println(updatedUser.toString());
	    User updated = userService.updateUser(token, updatedUser);
	    return ResponseEntity.ok(updated);
	}

}

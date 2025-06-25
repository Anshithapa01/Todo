package com.app.todo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.security.core.Authentication;

import com.app.todo.exception.UserException;
import com.app.todo.model.User;
import com.app.todo.request.UpdateUserRequest;

public interface UserService {

	User registerUser(User user);

	List<User> getAllUsers();

	Authentication authenticate(String username, String password);

	User findUserProfileByJwt(String jwt) throws UserException;

	User updateUser(String token, UpdateUserRequest updatedUser) throws UserException;

}

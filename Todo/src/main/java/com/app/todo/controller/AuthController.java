package com.app.todo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.app.todo.config.JwtProvider;
import com.app.todo.exception.UserException;
import com.app.todo.model.User;
import com.app.todo.request.LoginRequest;
import com.app.todo.response.AuthResponse;
import com.app.todo.service.UserService;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/auth")
public class AuthController {
	
	@Autowired
	private UserService userService;  
	@Autowired
	private JwtProvider jwtProvider;
	
	
	@PostMapping("/signup")
	public ResponseEntity<AuthResponse>createUserHandler(@RequestBody User user)throws UserException{
		try {
			User savedMentor=userService.registerUser(user);
			System.out.println(user.toString());
			Authentication authentication=new UsernamePasswordAuthenticationToken(savedMentor.getEmail(), savedMentor.getPassword());
			SecurityContextHolder.getContext().setAuthentication(authentication);
			String token=jwtProvider.generateToken(authentication);
			AuthResponse authResponse=new AuthResponse();
			authResponse.setJwt(token);
			authResponse.setMessage("Signup Success");
		return new ResponseEntity<AuthResponse>(authResponse,HttpStatus.CREATED);
		} catch (BadCredentialsException ex) {
	        return new ResponseEntity<>(new AuthResponse(null, ex.getMessage()), HttpStatus.UNAUTHORIZED);
	    }
	}
	
	@PostMapping("/signin")
	public ResponseEntity<AuthResponse>loginUserHandler(@RequestBody LoginRequest login)throws UserException{
		try {
			Authentication authentication=userService.authenticate(login.getEmail(),login.getPassword());
			SecurityContextHolder.getContext().setAuthentication(authentication);
			String token=jwtProvider.generateToken(authentication);
			AuthResponse authResponse=new AuthResponse();
			authResponse.setJwt(token);
			authResponse.setMessage("SignIn Success");
			return new ResponseEntity<AuthResponse>(authResponse,HttpStatus.OK);
		} catch (BadCredentialsException ex) {
	        return new ResponseEntity<>(new AuthResponse(null, ex.getMessage()), HttpStatus.UNAUTHORIZED);
	    }
	}
}

package com.app.todo.service.serviceImpl;

import java.util.List;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.app.todo.config.JwtProvider;
import com.app.todo.exception.UserException;
import com.app.todo.model.User;
import com.app.todo.repository.UserRepository;
import com.app.todo.request.UpdateUserRequest;
import com.app.todo.service.UserService;

@Service
public class UserServiceImpl implements UserService{
	
	private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
	private final CustomUserServiceImplementation customUserServiceImplementation;
	private final JwtProvider jwtProvider;
	

    public UserServiceImpl(UserRepository userRepository,
    		PasswordEncoder passwordEncoder,
    		CustomUserServiceImplementation customUserServiceImplementation,
    		JwtProvider jwtProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
		this.customUserServiceImplementation = customUserServiceImplementation;
		this.jwtProvider = jwtProvider;
		
    }

    @Override
	public List<User> getAllUsers() {
        return userRepository.findAll();
    }
	
	@Override
	public User registerUser(User user){
		String email = user.getEmail();
        User existingUser = userRepository.findByEmail(email);

        if (existingUser != null) {
        	throw new BadCredentialsException("Email is already used with another account");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);

        return savedUser;
	}
	
	@Override
	public Authentication authenticate(String username, String password) {
		UserDetails userDetails=customUserServiceImplementation.loadUserByUsername(username);
		if(userDetails==null) {
			throw new BadCredentialsException("Invalid Username...");
		}
		if(!passwordEncoder.matches(password,userDetails.getPassword())) {
			throw new BadCredentialsException("Invalid password...");
		}
		return new UsernamePasswordAuthenticationToken(
		        userDetails,
		        null,
		        userDetails.getAuthorities()
		    );
	}
	
	@Override
	public User findUserProfileByJwt(String jwt) throws UserException {
		if (jwt == null || jwt.isEmpty()) {
	        throw new UserException("Invalid token");
	    }
		String email=jwtProvider.getEmailFromToken(jwt);
		User user=userRepository.findByEmail(email);
		if(user==null) {
			throw new UserException("User not found with email "+email);
		}
		return user;
	}

	@Override
	public User updateUser(String token, UpdateUserRequest updatedUser) throws UserException {
	    User user = findUserProfileByJwt(token);
	    if (user == null) {
	        throw new UserException("User not found");
	    }
	    
	    user.setUsername(updatedUser.getUsername()); // Allow username updates
	    return userRepository.save(user);
	}

}

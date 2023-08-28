package com.sanprj.healthcareapp.service;


import com.sanprj.healthcareapp.entity.User;
import com.sanprj.healthcareapp.exception.InvalidInputException;
import com.sanprj.healthcareapp.exception.ResourceUnAvailableException;
import com.sanprj.healthcareapp.provider.PasswordCryptographyProvider;
import com.sanprj.healthcareapp.repository.UserRepository;
import com.sanprj.healthcareapp.util.ValidationUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Service
public class UserService {
	private final UserRepository userRepository;

	@Autowired
	private PasswordCryptographyProvider passwordCryptographyProvider;


	public User register(User user) throws InvalidInputException {
		ValidationUtils.validate(user);

		user.setCreatedDate(LocalDate.now().toString());
		encryptPassword(user);
		userRepository.save(user);
		return user;
	}

	public User getUser(String id) {
		return Optional.ofNullable(userRepository.findById(id))
				.get()
				.orElseThrow(ResourceUnAvailableException::new);
	}

	// Method that returns a List of type User
	public List<User> getAllUsers() {
		// Return all the users from the database
		return userRepository.findAll();
	}

	private void encryptPassword(final User newUser) {

		String password = newUser.getPassword();
		final String[] encryptedData = passwordCryptographyProvider.encrypt(password);
		newUser.setSalt(encryptedData[0]);
		newUser.setPassword(encryptedData[1]);
	}
}

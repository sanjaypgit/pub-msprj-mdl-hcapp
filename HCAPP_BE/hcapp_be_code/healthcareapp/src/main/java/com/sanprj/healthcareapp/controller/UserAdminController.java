package com.sanprj.healthcareapp.controller;

import com.sanprj.healthcareapp.entity.User;
import com.sanprj.healthcareapp.exception.InvalidInputException;
import com.sanprj.healthcareapp.service.AppointmentService;
import com.sanprj.healthcareapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/users")
public class UserAdminController {

	@Autowired
	private UserService userService;

	@Autowired
	private AppointmentService appointmentService;


	@GetMapping(path = "/{id}")
	public ResponseEntity<User> getUser(@RequestHeader("authorization") String accessToken,
	                                    @PathVariable("id") final String userUuid) {
		final User User = userService.getUser(userUuid);
		return ResponseEntity.ok(User);
	}
	
	// Post method named createUser with return type as ResponseEntity
	@PostMapping(value = "/register", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<User> createUser (@RequestBody final User user) throws InvalidInputException {

		// Register the user
		User registeredUser = userService.register(user);

		// Return http response with status set to OK
		return new ResponseEntity<>(registeredUser, HttpStatus.OK);
	}
	

	@GetMapping("/{userId}/appointments")
	public ResponseEntity getAppointmentForUser(@PathVariable("userId") String userId) {
		return ResponseEntity.ok(appointmentService.getAppointmentsForUser(userId));
	}


}

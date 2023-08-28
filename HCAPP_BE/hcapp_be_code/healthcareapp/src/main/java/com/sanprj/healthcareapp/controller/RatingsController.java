package com.sanprj.healthcareapp.controller;

import com.sanprj.healthcareapp.entity.Rating;
import com.sanprj.healthcareapp.service.RatingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class RatingsController {

	@Autowired
	private RatingsService ratingsService;


	// Post method named submitRatings with return type as ResponseEntity
	@PostMapping(value = "/ratings", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<?> submitRatings (@RequestBody Rating rating) {

		// Submit the ratings
		ratingsService.submitRatings(rating);

		// Return http response with status set to OK
		return new ResponseEntity<>(HttpStatus.OK);
	}
}

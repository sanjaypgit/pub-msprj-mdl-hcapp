package com.sanprj.healthcareapp.service;

import com.sanprj.healthcareapp.entity.Doctor;
import com.sanprj.healthcareapp.entity.Rating;
import com.sanprj.healthcareapp.exception.ResourceUnAvailableException;
import com.sanprj.healthcareapp.repository.DoctorRepository;
import com.sanprj.healthcareapp.repository.RatingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;


@Service
public class RatingsService {

	@Autowired
	private ApplicationEventPublisher publisher;

	@Autowired
	private RatingsRepository ratingsRepository;

	@Autowired
	private DoctorRepository doctorRepository;

	
	// Method name submitRatings with void return type and parameter of type Rating
	public void submitRatings(Rating rating) {

		rating.setId(UUID.randomUUID().toString());

		// Save ratings
		Rating savedRating = ratingsRepository.save(rating);

		// Get the doctor id
		String doctorIdInSavedRating = savedRating.getDoctorId();

		// Find specific doctor using doctor id
		Doctor doctor = Optional.ofNullable(doctorRepository.findById(doctorIdInSavedRating)).get().orElseThrow(ResourceUnAvailableException::new);

		// Average rating modified for that specific doctor by including the new rating
		int numberOfRatings = ratingsRepository.findByDoctorId(doctorIdInSavedRating).size();
		List<Rating> ratings = ratingsRepository.findByDoctorId(doctorIdInSavedRating);
		int sumOfRatingsValue = 0;
		for (Rating ratingElement : ratings) {
			sumOfRatingsValue = sumOfRatingsValue + ratingElement.getRating();
		}
		Double doctorAverageRating = (double) sumOfRatingsValue / numberOfRatings;
		doctor.setRating(doctorAverageRating);

		// The doctor object is saved to the database
		doctorRepository.save(doctor);
	}

}

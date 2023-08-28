package com.sanprj.healthcareapp.service;

import com.sanprj.healthcareapp.entity.Address;
import com.sanprj.healthcareapp.entity.Doctor;
import com.sanprj.healthcareapp.enums.Speciality;
import com.sanprj.healthcareapp.exception.InvalidInputException;
import com.sanprj.healthcareapp.exception.ResourceUnAvailableException;
import com.sanprj.healthcareapp.model.TimeSlot;
import com.sanprj.healthcareapp.repository.AddressRepository;
import com.sanprj.healthcareapp.repository.AppointmentRepository;
import com.sanprj.healthcareapp.repository.DoctorRepository;
import com.sanprj.healthcareapp.util.ValidationUtils;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import springfox.documentation.annotations.Cacheable;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Log4j2
@Service
public class DoctorService {
	@Autowired
	private AppointmentRepository appointmentRepository;
	@Autowired
	private DoctorRepository doctorRepository;
	@Autowired
	private AddressRepository addressRepository;

	
	// Method register with return type and parameter of typeDoctor
	public Doctor register(Doctor doctor) throws IllegalArgumentException, InvalidInputException {

		// Validate the doctor details
		ValidationUtils.validate(doctor);

		// If address is null throw InvalidInputException
		if (doctor.getAddress() == null)
			throw new InvalidInputException(null);

		doctor.setId(UUID.randomUUID().toString());

		// If speciality is null
		if (doctor.getSpeciality() == null)
			// Set speciality to Speciality.GENERAL_PHYSICIAN
			doctor.setSpeciality(Speciality.GENERAL_PHYSICIAN);

		// Address object initialised with address details from the doctor object
		Address doctorAddress = doctor.getAddress();

		// Address object saved to the database. The response is stored.
		Address responseAddress = addressRepository.save(doctorAddress);

		// The address is set in the doctor object with the response
		doctor.setAddress(responseAddress);

		// The doctor object is saved to the database
		Doctor registeredDoctor = doctorRepository.save(doctor);

		// The doctor object is returned
		return registeredDoctor;
	}
	
	
	//create a method name getDoctor that returns object of type Doctor and has a String paramter called id
	public Doctor getDoctor(String id) {
		//find the doctor by id
		Optional<Doctor> doctorFoundById = doctorRepository.findById(id);
		//if doctor is found return the doctor
		//else throw ResourceUnAvailableException
		return Optional.ofNullable(doctorFoundById)
				.get()
				.orElseThrow(ResourceUnAvailableException::new); // SP Check Again
	}


	public List<Doctor> getAllDoctorsWithFilters(String speciality) {

		if (speciality != null && !speciality.isEmpty()) {
			return doctorRepository.findBySpecialityOrderByRatingDesc(Speciality.valueOf(speciality));
		}
		return getActiveDoctorsSortedByRating();
	}

	@Cacheable(value = "doctorListByRating")
	private List<Doctor> getActiveDoctorsSortedByRating() {
		log.info("Fetching doctor list from the database");
		return doctorRepository.findAllByOrderByRatingDesc()
				.stream()
				.limit(20)
				.collect(Collectors.toList());
	}

	public TimeSlot getTimeSlots(String doctorId, String date) {

		TimeSlot timeSlot = new TimeSlot(doctorId, date);
		timeSlot.setTimeSlot(timeSlot.getTimeSlot()
				.stream()
				.filter(slot -> {
					return appointmentRepository
							.findByDoctorIdAndTimeSlotAndAppointmentDate(timeSlot.getDoctorId(), slot, timeSlot.getAvailableDate()) == null;

				})
				.collect(Collectors.toList()));

		return timeSlot;

	}
}

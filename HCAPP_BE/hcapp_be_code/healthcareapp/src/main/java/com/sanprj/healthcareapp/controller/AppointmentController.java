package com.sanprj.healthcareapp.controller;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.sanprj.healthcareapp.entity.Appointment;
import com.sanprj.healthcareapp.exception.InvalidInputException;
import com.sanprj.healthcareapp.exception.SlotUnavailableException;
import com.sanprj.healthcareapp.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

	@Autowired
	private AppointmentService appointmentService;


	//Method post method named bookAppointment with return type ReponseEntity
	@PostMapping(value = "", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> bookAppointment(@RequestBody Appointment appointmentDTO) throws InvalidInputException {

		// The appointment details to the database and the response from the method used, are saved
		final Appointment appointmentToBeSaved = new Appointment();
		appointmentToBeSaved.setDoctorId(appointmentDTO.getDoctorId());
		appointmentToBeSaved.setDoctorName(appointmentDTO.getDoctorName());
		appointmentToBeSaved.setUserId(appointmentDTO.getUserId());
		appointmentToBeSaved.setUserName(appointmentDTO.getUserName());
		appointmentToBeSaved.setUserEmailId(appointmentDTO.getUserEmailId());
		appointmentToBeSaved.setTimeSlot(appointmentDTO.getTimeSlot());
		appointmentToBeSaved.setStatus(appointmentDTO.getStatus());
		appointmentToBeSaved.setAppointmentDate(appointmentDTO.getAppointmentDate());
		appointmentToBeSaved.setCreatedDate(appointmentDTO.getCreatedDate());
		appointmentToBeSaved.setSymptoms(appointmentDTO.getSymptoms());
		appointmentToBeSaved.setPriorMedicalHistory(appointmentDTO.getPriorMedicalHistory());

		String idOfSavedAppointment = appointmentService.appointment(appointmentToBeSaved);

		// return http response
		return new ResponseEntity<>(idOfSavedAppointment, HttpStatus.CREATED);
	}
	

	// Get method getAppointment with return type as ResponseEntity
	@GetMapping(value = "/{appointmentId}", produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<Appointment> getAppointment (@PathVariable String appointmentId) {
		// PathVariable annotation used to identity appointment using the parameter defined

		//get the appointment details using the appointmentId, save the response and return the response
		Appointment appointmentFoundByAppointmentID = appointmentService.getAppointment(appointmentId);
		return new ResponseEntity<>(appointmentFoundByAppointmentID, HttpStatus.OK);

	}

}
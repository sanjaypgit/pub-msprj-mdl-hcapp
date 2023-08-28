package com.sanprj.healthcareapp.service;

import com.sanprj.healthcareapp.entity.Appointment;
import com.sanprj.healthcareapp.entity.Doctor;
import com.sanprj.healthcareapp.exception.InvalidInputException;
import com.sanprj.healthcareapp.exception.ResourceUnAvailableException;
import com.sanprj.healthcareapp.exception.SlotUnavailableException;
import com.sanprj.healthcareapp.repository.AppointmentRepository;
import com.sanprj.healthcareapp.repository.UserRepository;
import com.sanprj.healthcareapp.util.ValidationUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.lang.String;

@Service
@RequiredArgsConstructor
public class AppointmentService {


	@Autowired
	private AppointmentRepository appointmentRepository;

	@Autowired
	private UserRepository userRepository;


	// Method name appointment with the return type of String and parameter of type Appointment
	public String appointment(Appointment appointment) throws SlotUnavailableException, InvalidInputException {

		// Validate the appointment details
		ValidationUtils.validate(appointment);

		// Find if an appointment exists with the same doctor for the same date and time
		// If the appointment exists throw the SlotUnavailableException
		if (appointment == appointmentRepository.findByDoctorIdAndTimeSlotAndAppointmentDate(appointment.getDoctorId(), appointment.getTimeSlot(), appointment.getAppointmentDate()))
			throw new SlotUnavailableException();

		// Appointment details saved to the database
		Appointment savedAppointment = appointmentRepository.save(appointment);

		// The appointment id is returned
		return savedAppointment.getAppointmentId();
	}


	// Method getAppointment of type Appointment with a parameter name appointmentId of type String
	public Appointment getAppointment (String appointmentId) {
		// The appointmentid is used to get the appointment details
		Optional<Appointment> appointmentFoundById = Optional.ofNullable(appointmentRepository.findById(appointmentId).orElseThrow(NullPointerException::new));

		// If the appointment exists return the appointment
		// Else throw ResourceUnAvailableException
		return appointmentFoundById.orElseThrow(ResourceUnAvailableException::new);
	}

	public List<Appointment> getAppointmentsForUser (String userId){
		return appointmentRepository.findByUserId(userId);
	}
}

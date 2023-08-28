package com.sanprj.healthcareapp.repository;

import com.sanprj.healthcareapp.entity.Rating;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;




@Repository
public interface RatingsRepository extends CrudRepository<Rating, String> {
	// Method findByDoctorId that returns a list of type Rating
    List<Rating> findByDoctorId(String doctorId);
}
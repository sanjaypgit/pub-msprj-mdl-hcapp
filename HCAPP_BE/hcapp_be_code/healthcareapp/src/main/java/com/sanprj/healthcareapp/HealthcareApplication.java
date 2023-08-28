package com.sanprj.healthcareapp;

import com.sanprj.healthcareapp.config.ApiConfiguration;
import com.sanprj.healthcareapp.config.WebConfiguration;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;

@SpringBootApplication
@Import({ApiConfiguration.class, WebConfiguration.class})
public class HealthcareApplication {
	public static void main(String[] args) {
		SpringApplication.run(HealthcareApplication.class, args);
	}

}


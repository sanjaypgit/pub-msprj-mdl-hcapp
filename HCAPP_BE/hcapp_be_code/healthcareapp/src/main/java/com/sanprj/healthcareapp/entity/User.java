package com.sanprj.healthcareapp.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;


@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class User {

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    private String dob;

    private String mobile;

    @Id
    @Column(name = "email_id")
    private String emailId;

    @Column(name = "password", unique = true) // SP Verify
    private String password;

    @Column(name = "created_date")
    private String createdDate;

    private String salt;

}
package com.sanprj.healthcareapp.repository;

import com.sanprj.healthcareapp.entity.Address;
import com.sanprj.healthcareapp.entity.Rating;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface AddressRepository extends CrudRepository<Address, String> {
    List<Address> findAddressById(String id);
}

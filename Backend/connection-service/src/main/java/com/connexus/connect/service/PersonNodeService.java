package com.connexus.connect.service;
import org.springframework.stereotype.Service;

import com.connexus.connect.dto.PersonDto;
import com.connexus.connect.entity.Person;
import com.connexus.connect.repository.PersonNodeRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Service
@Slf4j
public class PersonNodeService {
	
	private final PersonNodeRepository personRepository;
	
	public void createPersonNode(PersonDto personDto) {
			
	    	if(personRepository.existsByUserId(personDto.getUserId())) {
	    		return;
	    	}
	    	Person newPerson = new Person();
	    	newPerson.setUserId(personDto.getUserId());
	    	newPerson.setName(personDto.getName());
	    	newPerson.setRole(personDto.getRole());
	    	log.info("Person Dto {}", newPerson);
	    	personRepository.save(newPerson);
    		log.info("Person node created with userId {}", personDto.getUserId());
	    	
	 }
}

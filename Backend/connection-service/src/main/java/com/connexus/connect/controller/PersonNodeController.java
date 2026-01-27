package com.connexus.connect.controller;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.connexus.connect.dto.PersonDto;
import com.connexus.connect.entity.Person;
import com.connexus.connect.service.PersonNodeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/person-node")
@RequiredArgsConstructor
public class PersonNodeController {
	private final PersonNodeService personNodeService;
	
	@PostMapping
	public void createPersonNode(@RequestBody PersonDto person){
		personNodeService.createPersonNode(person);
	}
}

package com.connexus.user.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.connexus.user.dto.PersonDto;


@FeignClient(name = "connection-service", path = "/connect")
public interface ConnectionsClient {

    @PostMapping("/person-node")
    void createPersonNode(@RequestBody PersonDto person);
}
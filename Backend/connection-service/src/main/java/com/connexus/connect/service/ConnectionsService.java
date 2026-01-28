package com.connexus.connect.service;

import com.connexus.connect.auth.UserContextHolder;
import com.connexus.connect.entity.Person;
import com.connexus.connect.event.AcceptConnectionRequestEvent;
import com.connexus.connect.event.SendConnectionRequestEvent;
import com.connexus.connect.exception.AccessDeniedException;
import com.connexus.connect.repository.PersonNodeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
@Slf4j
public class ConnectionsService {

    private final PersonNodeRepository personRepository;
    private final KafkaTemplate<Long, SendConnectionRequestEvent> sendRequestKafkaTemplate;
    private final KafkaTemplate<Long, AcceptConnectionRequestEvent> acceptRequestKafkaTemplate;

    public List<Person> getFirstDegreeConnections() {
        Long userId = UserContextHolder.getCurrentUserId();
        log.info("Getting first degree connections for user with id: {}", userId);

        return personRepository.getFirstDegreeConnections(userId);
    }

    public List<Person> getIncomingConnectionRequests() {
        Long userId = UserContextHolder.getCurrentUserId();
        log.info("Getting incoming connection requests for user with id: {}", userId);

        return personRepository.getIncomingConnectionRequests(userId);
    }

    public Boolean sendConnectionRequest(Long receiverId) {
        Long senderId = UserContextHolder.getCurrentUserId();
        String senderRole = UserContextHolder.getCurrentUserRole();

        log.info("Trying to send connection request, sender: {}, reciever: {}", senderId, receiverId);

        String receiverRole = personRepository.getRoleByUserId(receiverId);

        validateConnectionRequestByRole(receiverRole, senderRole);

        if (senderId.equals(receiverId)) {
            throw new RuntimeException("Both sender and receiver are the same");
        }

        boolean alreadySentRequest = personRepository.connectionRequestExists(senderId, receiverId);
        if (alreadySentRequest) {
            throw new RuntimeException("Connection request already exists, cannot send again");
        }

        boolean alreadyConnected = personRepository.alreadyConnected(senderId, receiverId);
        if (alreadyConnected) {
            throw new RuntimeException("Already connected users, cannot add connection request");
        }

        log.info("Successfully sent the connection request");
        personRepository.addConnectionRequest(senderId, receiverId);

        // Send connection request notification
        SendConnectionRequestEvent sendConnectionRequestEvent = SendConnectionRequestEvent.builder()
                .senderId(senderId)
                .receiverId(receiverId)
                .build();

        sendRequestKafkaTemplate.send("send-connection-request-topic", sendConnectionRequestEvent);

        return true;
    }

    private void validateConnectionRequestByRole(String receiverRole, String senderRole) {
        log.info("Sender role : {}" + senderRole);
        log.info("Receiver role : {}" + receiverRole);
        if ("ROLE_USER".equals(senderRole) && "ROLE_RECRUITER".equals(receiverRole)) {
            throw new AccessDeniedException(
                    "Users cannot send connection request to recruiters");
        }

        if ("ROLE_RECRUITER".equals(senderRole) && "ROLE_RECRUITER".equals(receiverRole)) {
            throw new AccessDeniedException(
                    "Recruiters cannot connect with recruiters");
        }
    }

    public Boolean acceptConnectionRequest(Long senderId) {
        Long receiverId = UserContextHolder.getCurrentUserId();

        boolean connectionRequestExists = personRepository.connectionRequestExists(senderId, receiverId);
        if (!connectionRequestExists) {
            throw new RuntimeException("No connection request exists to accept");
        }

        personRepository.acceptConnectionRequest(senderId, receiverId);
        log.info("Successfully accepted the connection request, sender: {}, receiver: {}", senderId, receiverId);

        // accept connection request notification

        AcceptConnectionRequestEvent acceptConnectionRequestEvent = AcceptConnectionRequestEvent.builder()
                .senderId(senderId)
                .receiverId(receiverId)
                .build();

        acceptRequestKafkaTemplate.send("accept-connection-request-topic", acceptConnectionRequestEvent);

        return true;
    }

    public Boolean rejectConnectionRequest(Long senderId) {
        Long receiverId = UserContextHolder.getCurrentUserId();

        boolean connectionRequestExists = personRepository.connectionRequestExists(senderId, receiverId);
        if (!connectionRequestExists) {
            throw new RuntimeException("No connection request exists, cannot delete");
        }

        personRepository.rejectConnectionRequest(senderId, receiverId);
        return true;
    }
}

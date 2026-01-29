package com.connexus.messaging.repository;

import com.connexus.messaging.model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends MongoRepository<Message, String> {

    // Find chat history between two users
    @Query("{ $or: [ { 'senderId': ?0, 'recipientId': ?1 }, { 'senderId': ?1, 'recipientId': ?0 } ] }")
    List<Message> findChatHistory(String userId1, String userId2);

    List<Message> findByRecipientIdAndStatus(String recipientId, com.connexus.messaging.model.MessageStatus status);

    List<Message> findByRecipientIdAndSenderIdAndStatus(String recipientId, String senderId,
            com.connexus.messaging.model.MessageStatus status);
}

package com.connexus.messaging.controller;

import com.connexus.messaging.model.Message;
import com.connexus.messaging.model.MessageStatus;
import com.connexus.messaging.repository.MessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Date;
import java.util.List;

@Controller
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final MessageRepository messageRepository;

    @MessageMapping("/chat")
    public void processMessage(@Payload Message message) {
        message.setTimestamp(new Date());
        message.setStatus(MessageStatus.RECEIVED);

        Message saved = messageRepository.save(message);

        // Send to recipient's queue: /queue/messages/{recipientId}
        messagingTemplate.convertAndSend("/queue/messages/" + message.getRecipientId(), saved);

        // Also send back to sender so they see it confirmed/rendered same way?
        // Or frontend handles optimistic UI.
        // Let's send to sender too for sync if they have multiple tabs open.
        messagingTemplate.convertAndSend("/queue/messages/" + message.getSenderId(), saved);
    }

    @GetMapping("/messages/{userId1}/{userId2}")
    @ResponseBody
    public ResponseEntity<List<Message>> getChatHistory(@PathVariable String userId1, @PathVariable String userId2) {
        List<Message> history = messageRepository.findChatHistory(userId1, userId2);
        // Sort by date is implied by insertion, but explicit sort is better.
        // Mongo auto IDs are rough time sorted.
        return ResponseEntity.ok(history);
    }

    @GetMapping("/messages/unread/{userId}")
    @ResponseBody
    public ResponseEntity<java.util.Map<String, Long>> getUnreadCounts(@PathVariable String userId) {
        // Find all RECEIVED messages where recipient is userId
        List<Message> unreadMessages = messageRepository.findByRecipientIdAndStatus(userId, MessageStatus.RECEIVED);

        // Group by senderId and count
        java.util.Map<String, Long> unreadCounts = unreadMessages.stream()
                .collect(java.util.stream.Collectors.groupingBy(Message::getSenderId,
                        java.util.stream.Collectors.counting()));

        return ResponseEntity.ok(unreadCounts);
    }

    @org.springframework.web.bind.annotation.PutMapping("/messages/read/{userId}/{senderId}")
    @ResponseBody
    public ResponseEntity<Void> markMessagesAsRead(@PathVariable String userId, @PathVariable String senderId) {
        List<Message> messages = messageRepository.findByRecipientIdAndSenderIdAndStatus(userId, senderId,
                MessageStatus.RECEIVED);
        if (!messages.isEmpty()) {
            messages.forEach(m -> m.setStatus(MessageStatus.READ));
            messageRepository.saveAll(messages);
        }
        return ResponseEntity.ok().build();
    }
}

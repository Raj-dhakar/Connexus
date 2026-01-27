package com.connexus.notification.post_service.event;

import lombok.Builder;
import lombok.Data;

@Data
public class PostCreatedEvent {
    Long creatorId;
    String title;
    Long postId;
}

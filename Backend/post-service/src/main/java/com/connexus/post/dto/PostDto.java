package com.connexus.post.dto;

import jakarta.persistence.Column;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
public class PostDto {
    private Long postId;
    private String title;
    private String description;
    private Long userId;
    private String mediaUrl;
    private long likeCount;
    private boolean isLiked;
}

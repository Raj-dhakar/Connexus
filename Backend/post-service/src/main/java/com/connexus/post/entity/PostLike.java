package com.connexus.post.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AttributeOverride(name="id",column = @Column(name="post_like_id"))
@Table(name = "post_likes")
public class PostLike extends BaseEntity{

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Long postId;

}

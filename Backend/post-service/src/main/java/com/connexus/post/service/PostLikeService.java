package com.connexus.post.service;


import com.connexus.post.auth.UserContextHolder;
import com.connexus.post.entity.Post;
import com.connexus.post.entity.PostLike;
import com.connexus.post.event.PostLikedEvent;
import com.connexus.post.exception.BadRequestException;
import com.connexus.post.exception.ResourceNotFoundException;
import com.connexus.post.repository.PostLikeRepository;
import com.connexus.post.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class PostLikeService {

    private final PostLikeRepository postLikeRepository;
    private final PostRepository postsRepository;
    private final KafkaTemplate<Long, PostLikedEvent> kafkaTemplate;

    public void likePost(Long postId) {
        log.info("Attempting to like the post with id: {}", postId);
        Long userId = UserContextHolder.getCurrentUserId();

        Post post = postsRepository.findById(postId).orElseThrow(
                () -> new ResourceNotFoundException("Post not found with id: "+postId));

        boolean alreadyLiked = postLikeRepository.existsByUserIdAndPostId(userId, postId);
        if(alreadyLiked) throw new BadRequestException("Cannot like the same post again.");

        PostLike postLike = new PostLike();
        postLike.setPostId(postId);
        postLike.setUserId(userId);
        postLikeRepository.save(postLike);
        // Notify all users
        PostLikedEvent postLikedEvent = PostLikedEvent.builder()
                .postId(postId)
                .likedByUserId(userId)
                .creatorId(post.getUserId()).build();

        kafkaTemplate.send("post-liked-topic", postId, postLikedEvent); // ordered by postId
        log.info("Post with id: {} liked successfully", postId);
    }

    public void unlikePost(Long postId) {
        Long userId = UserContextHolder.getCurrentUserId();
        log.info("Attempting to unlike the post with id: {}", postId);
        boolean exists = postsRepository.existsById(postId);
        if(!exists) throw new ResourceNotFoundException("Post not found with id: "+postId);

        boolean alreadyLiked = postLikeRepository.existsByUserIdAndPostId(userId, postId);
        if(!alreadyLiked) throw new BadRequestException("Cannot unlike the post which is not liked.");

        postLikeRepository.deleteByUserIdAndPostId(userId, postId);

        log.info("Post with id: {} unliked successfully", postId);
    }
}

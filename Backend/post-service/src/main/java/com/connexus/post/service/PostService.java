package com.connexus.post.service;

import com.connexus.post.auth.UserContextHolder;
import com.connexus.post.clients.ConnectionsClient;
import com.connexus.post.dto.PersonDto;
import com.connexus.post.dto.PostCreateRequestDto;
import com.connexus.post.dto.PostDto;
import com.connexus.post.entity.Post;
import com.connexus.post.event.PostCreatedEvent;
import com.connexus.post.exception.ResourceNotFoundException;
import com.connexus.post.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.event.KafkaEvent;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@Slf4j
public class PostService {

    private final PostRepository postRepository;
    private final ModelMapper modelMapper;
    private final ConnectionsClient connectionClient;
    // private final KafkaTemplate<Long, PostCreatedEvent> kafkaTemplate;
    private final CloudinaryService cloudinaryService;

    public PostDto createPost(PostCreateRequestDto postDto, MultipartFile media) {
        Long userId = UserContextHolder.getCurrentUserId();
        Post post = modelMapper.map(postDto, Post.class);
        post.setUserId(userId);
        if (media != null && !media.isEmpty()) {
            String mediaUrl = cloudinaryService.uploadFile(media, "posts");
            post.setMediaUrl(mediaUrl);
            log.info("Image url {}", mediaUrl);
        }
        Post savedPost = postRepository.save(post);
        /*
         * // Get first degree connections
         * // List<PersonDto> firstConnections = connectionClient.getFirstConnections();
         * // notify all users
         * PostCreatedEvent postCreatedEvent = PostCreatedEvent.builder()
         * .postId(savedPost.getId())
         * .creatorId(userId)
         * .title(savedPost.getTitle())
         * .build();
         * 
         * kafkaTemplate.send("post-created-topic", postCreatedEvent);
         * 
         */
        return modelMapper.map(savedPost, PostDto.class);
    }

    public PostDto getPostById(Long postId) {
        log.debug("Retrieving post with ID: {}", postId);

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));
        return modelMapper.map(post, PostDto.class);
    }

    public List<PostDto> getAllPostsOfUser(Long userId) {
        List<Post> posts = postRepository.findByUserId(userId);

        return posts
                .stream()
                .map((element) -> modelMapper.map(element, PostDto.class))
                .collect(Collectors.toList());
    }

    public Page<PostDto> getAllPost(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdOn").descending());
        Page<Post> posts = postRepository.findAll(pageable);

        return posts.map(element -> modelMapper.map(element, PostDto.class));
    }

    public List<PostDto> getAllPost() {
        List<Post> posts = postRepository.findAll();

        return posts
                .stream()
                .map((element) -> modelMapper.map(element, PostDto.class))
                .collect(Collectors.toList());
    }

    public PostDto updatePost(Long postId, PostCreateRequestDto postDto) {
        Long userId = UserContextHolder.getCurrentUserId();
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));

        if (!post.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to update post");
        }

        // Map updates - naive approach, normally would check for nulls
        if (postDto.getTitle() != null)
            post.setTitle(postDto.getTitle());
        if (postDto.getDescription() != null)
            post.setDescription(postDto.getDescription());

        post = postRepository.save(post);
        return modelMapper.map(post, PostDto.class);
    }

    public void deletePost(Long postId) {
        Long userId = UserContextHolder.getCurrentUserId();
        String userRole = UserContextHolder.getCurrentUserRole();
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));

        if (!post.getUserId().equals(userId) && !userRole.equals("ROLE_ADMIN")) {
            throw new RuntimeException("Unauthorized access to delete post");
        }

        postRepository.delete(post);
    }

    public PostDto updatePostMedia(Long postId, MultipartFile media) {
        Long userId = UserContextHolder.getCurrentUserId();
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));

        if (!post.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to update post media");
        }

        if (media != null && !media.isEmpty()) {
            String mediaUrl = cloudinaryService.uploadFile(media, "posts");
            post.setMediaUrl(mediaUrl);
            post = postRepository.save(post);
        }

        return modelMapper.map(post, PostDto.class);
    }

}

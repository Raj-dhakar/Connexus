package com.connexus.post.controller;

import com.connexus.post.advices.ApiResponse;
import com.connexus.post.auth.UserContextHolder;
import com.connexus.post.dto.PostCreateRequestDto;
import com.connexus.post.dto.PostDto;
import com.connexus.post.service.PostService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
public class PostsController {

    private final PostService postsService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PostDto> createPost(
            @RequestPart("post") String postJson,
            @RequestPart(value = "media", required = false) MultipartFile media
    ) throws JsonProcessingException {
        PostCreateRequestDto postDto =
                new ObjectMapper().readValue(postJson, PostCreateRequestDto.class);
        PostDto createdPost = postsService.createPost(postDto, media);
        return new ResponseEntity<>(createdPost, HttpStatus.CREATED);
    }

    @GetMapping("/{postId}")
    public ResponseEntity<PostDto> getPost(@PathVariable Long postId, HttpServletRequest servletRequest) {
        Long userId = UserContextHolder.getCurrentUserId();
        PostDto postDto = postsService.getPostById(postId);
        return ResponseEntity.ok(postDto);
    }

    @GetMapping()
    public ResponseEntity<Object> getAllPost(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) boolean paginated) {

        if (paginated) {
            Page<PostDto> posts = postsService.getAllPost(page, size);
            return ResponseEntity.ok(posts);
        } else {
            // Backward compatibility or default list view
            List<PostDto> allPosts = postsService.getAllPost();
            return ResponseEntity.ok(allPosts);
        }
    }

    @GetMapping("/users/{userId}/allPosts")
    public ResponseEntity<List<PostDto>> getAllPostsOfUser(@PathVariable Long userId) {
        List<PostDto> posts = postsService.getAllPostsOfUser(userId);
        return ResponseEntity.ok(posts);
    }

    @PostMapping(value = "/test", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<String>> test(@RequestPart("file") MultipartFile file) {
        return ResponseEntity.ok(new ApiResponse(file.getOriginalFilename()));
    }


}

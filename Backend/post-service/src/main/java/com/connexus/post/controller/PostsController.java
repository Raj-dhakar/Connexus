package com.connexus.post.controller;

import com.connexus.post.auth.UserContextHolder;
import com.connexus.post.dto.PostCreateRequestDto;
import com.connexus.post.dto.PostDto;
import com.connexus.post.service.PostService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
public class PostsController {

    private final PostService postsService;

    @PostMapping
    public ResponseEntity<PostDto> createPost(@RequestBody PostCreateRequestDto postDto, HttpServletRequest servletRequest) {

        PostDto createdPost = postsService.createPost(postDto);
        return new ResponseEntity<>(createdPost, HttpStatus.CREATED);
    }

    @GetMapping("/{postId}")
    public ResponseEntity<PostDto> getPost(@PathVariable Long postId, HttpServletRequest servletRequest) {
        Long userId = UserContextHolder.getCurrentUserId();
        PostDto postDto = postsService.getPostById(postId);
        return ResponseEntity.ok(postDto);
    }
    
    @GetMapping()
    public ResponseEntity<List<PostDto>> getAllPost() {
        Long userId = UserContextHolder.getCurrentUserId();
        List<PostDto> allPosts  = postsService.getAllPost();
        return ResponseEntity.ok(allPosts);
    }

    @GetMapping("/users/{userId}/allPosts")
    public ResponseEntity<List<PostDto>> getAllPostsOfUser(@PathVariable Long userId) {
        List<PostDto> posts = postsService.getAllPostsOfUser(userId);
        return ResponseEntity.ok(posts);
    }

}

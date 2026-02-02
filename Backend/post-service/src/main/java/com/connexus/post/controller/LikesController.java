package com.connexus.post.controller;

import com.connexus.post.advices.ApiResponse;
import com.connexus.post.service.PostLikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/likes")
@RequiredArgsConstructor
public class LikesController {

    private final PostLikeService postLikeService;

    @PostMapping("/{postId}")
    public ResponseEntity<ApiResponse<String>> likePost(@PathVariable Long postId) {
        postLikeService.likePost(postId);
        return ResponseEntity.ok(new ApiResponse<>("Post liked successfully"));
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<ApiResponse<String>> unlikePost(@PathVariable Long postId) {
        postLikeService.unlikePost(postId);
        return ResponseEntity.ok(new ApiResponse<>("Post unliked successfully"));
    }

}


import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Stack,
    CircularProgress,
    Container
} from '@mui/material';
import { motion } from 'framer-motion';
import FeedPost from './FeedPost';
import postApi from '../../../api/postApi';
import Navbar from '../../layout/Navbar';
import useAuth from '../../auth/useAuth';
import ProfileDialog from '../../profile/components/ProfileDialog';

import { toast } from 'react-toastify';

function UserPosts() {
    const { user: currentUser } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [profileOpen, setProfileOpen] = useState(false);

    useEffect(() => {
        const fetchUserPosts = async () => {
            if (!currentUser?.id) {
                setLoading(false);
                return;
            }

            try {
                // Fetch all posts for the current user
                const response = await postApi.getPostsByUser(currentUser.id);
                // response.data could be List<PostDto> or ApiResponse<List<PostDto>>
                // Safely handle both
                const fetchedPosts = Array.isArray(response.data) ? response.data : (response.data.data || []);

                const enrichedPosts = fetchedPosts.map(post => ({
                    ...post,
                    username: currentUser.username,
                    profile_image: currentUser.profile_image,
                    designation: currentUser.designation || "User"
                }));

                const sortedPosts = enrichedPosts.sort((a, b) => b.postId - a.postId);

                setPosts(sortedPosts);
            } catch (error) {
                console.error("Failed to fetch user posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserPosts();
    }, [currentUser]);

    const handleProfileClick = (user) => {
        const userDto = {
            id: user.userId || user.user_id || user.id,
            firstName: user.username,
            lastName: "",
            username: user.username,
            profileImage: user.profile_image,
            designation: user.designation,
            role: "USER"
        };
        setSelectedUser(userDto);
        setProfileOpen(true);
    };

    const handleUpdate = async (postId, updatedData) => {
        try {
            const response = await postApi.updatePost(postId, updatedData);
            // Expect response.data.data to be the updated PostDto
            const updatedPost = response.data.data;
            if (updatedPost) {
                setPosts(prev => prev.map(p => p.postId === postId ? {
                    ...p,
                    ...updatedPost,
                    // Preserve enriched fields if backend doesn't return them (likely)
                    username: p.username,
                    profile_image: p.profile_image,
                    designation: p.designation
                } : p));
                toast.success("Post updated successfully");
            }
        } catch (error) {
            console.error("Failed to update post:", error);
            toast.error("Failed to update post");
        }
    };

    const handleDelete = async (postId) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        try {
            await postApi.deletePost(postId);
            setPosts(prev => prev.filter(p => p.postId !== postId));
            toast.success("Post deleted successfully");
        } catch (error) {
            console.error("Failed to delete post:", error);
            toast.error("Failed to delete post");
        }
    };

    const handleUpdateMedia = async (postId, file) => {
        try {
            const formData = new FormData();
            formData.append('media', file);

            const response = await postApi.updatePostMedia(postId, formData);
            const updatedPost = response.data.data;

            if (updatedPost) {
                setPosts(prev => prev.map(p => p.postId === postId ? {
                    ...p,
                    ...updatedPost,
                    username: p.username,
                    profile_image: p.profile_image,
                    designation: p.designation
                } : p));
                toast.success("Post image updated successfully");
            }
        } catch (error) {
            console.error("Failed to update post media:", error);
            toast.error("Failed to update post image");
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', pb: 4 }}>
            <Navbar userData={currentUser} />
            <Container maxWidth="md" sx={{ pt: 12 }}>
                <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'text.primary' }}>
                    My Posts
                </Typography>

                <Stack spacing={2} component={motion.div} layout>
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <FeedPost
                                key={post.postId}
                                post={post}
                                onProfileClick={handleProfileClick}
                                onUpdate={handleUpdate}
                                onDelete={handleDelete}
                                onUpdateMedia={handleUpdateMedia}
                            />
                        ))
                    ) : (
                        <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mt: 5 }}>
                            You haven't posted anything yet.
                        </Typography>
                    )}
                </Stack>
            </Container>

            <ProfileDialog
                open={profileOpen}
                onClose={() => setProfileOpen(false)}
                user={selectedUser}
            />
        </Box>
    );
}

export default UserPosts;

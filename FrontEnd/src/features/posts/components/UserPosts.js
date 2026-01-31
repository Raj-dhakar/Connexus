
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
                // Endpoint: /posts/users/{userId}/allPosts
                const response = await postApi.getPostsByUser(currentUser.id);
                // response.data is List<PostDto>
                // Sort by recent first (assuming higher ID is more recent or if there is a date field)
                // If backend doesn't sort, we can sort here. Generally ID sort is safe proxy for time if auto-increment.
                // Or if there's a createdAt field. Let's assume response might need sorting.

                const fetchedPosts = response.data.data || [];

                // Inject current user details into each post since PostDto doesn't contain them
                // and we know these posts belong to the current user.
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
        // Map user data for ProfileDialog if needed, similar to Middle.js
        const userDto = {
            id: user.user_id || user.id || user.userId,
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

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', backgroundColor: '#f0f2f5', pb: 4 }}>
            <Navbar userData={currentUser} />
            <Container maxWidth="md" sx={{ pt: 12 }}>
                <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#1a1a1a' }}>
                    My Posts
                </Typography>

                <Stack spacing={2} component={motion.div} layout>
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <FeedPost
                                key={post.postId}
                                post={post}
                                onProfileClick={handleProfileClick}
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

import React, { useRef } from 'react';
import {
    Card,
    CardContent,
    CardMedia,
    TextField,
    Typography,
    Avatar,
    Box,
    Button,
    IconButton,
    InputAdornment,
    Stack,
    Divider
} from '@mui/material';
import {
    Image as ImageIcon,
    Event as EventIcon,
    Article as ArticleIcon,
    Send as SendIcon
} from '@mui/icons-material';
import Post from './Post';
import Filepost from './Filepost';
import usePosts from '../usePosts';

import { motion } from 'framer-motion';

import ProfileDialog from '../../profile/components/ProfileDialog'; // Import ProfileDialog
import { useState } from 'react';

function Middle({ userData }) {
    const postRef = useRef(null);
    const filePostRef = useRef(null);
    const { posts, loading, hasMore, loadMore } = usePosts();

    // State for managing Profile Dialog
    const [selectedUser, setSelectedUser] = useState(null);
    const [profileOpen, setProfileOpen] = useState(false);

    const handleProfileClick = (user) => {
        // Construct a user object compatible with ProfileDialog
        // Assuming 'post' object generally matches what ProfileDialog expects or we map it.
        // If post contains author info flattened, we might need to restructure.
        // Based on usePosts usage (mock/real), we'll assume basic fields exist.

        // Mapping post fields to user dto fields if necessary
        const userDto = {
            id: user.userId || user.id, // Adaptation
            firstName: user.username, // Fallback if firstName/lastName not separate in simple post mock
            lastName: "",
            username: user.username,
            profileImage: user.profile_image,
            designation: user.designation,
            role: "USER" // Default assumption if not provided
            // Add other fields if available in 'post' object from API
        };

        setSelectedUser(userDto);
        setProfileOpen(true);
    };

    return (
        <Box component={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Create Post Card */}
            <Card sx={{ mb: 3, p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar src={userData?.profile_image} sx={{ width: 50, height: 50, mr: 2 }} />
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Start a post"
                        size="small"
                        onClick={() => postRef.current?.click()}
                        InputProps={{
                            sx: { borderRadius: 50, cursor: 'pointer' },
                            readOnly: true
                        }}
                    />
                </Box>
                <Stack direction="row" spacing={1} justifyContent="space-between" sx={{ px: 1 }}>
                    <Button
                        startIcon={<ImageIcon color="primary" />}
                        onClick={() => filePostRef.current?.click()}
                        sx={{ color: 'text.secondary' }}
                    >
                        Media
                    </Button>
                    <Button
                        startIcon={<EventIcon color="warning" />}
                        sx={{ color: 'text.secondary' }}
                    >
                        Event
                    </Button>
                    <Button
                        startIcon={<ArticleIcon color="error" />}
                        sx={{ color: 'text.secondary' }}
                    >
                        Article
                    </Button>
                </Stack>
                {/* Hidden Modals Triggers */}
                <Box sx={{ display: 'none' }}>
                    <Post ref={postRef} />
                    <Filepost ref={filePostRef} />
                </Box>
            </Card>

            {/* Posts Feed */}
            <Stack spacing={2} component={motion.div} layout>
                {posts.map((post, index) => (
                    <Card
                        key={post.postId || post.id || index}
                        component={motion.div}
                        layout
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        viewport={{ once: true }}
                    >
                        <CardContent sx={{ pb: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Avatar
                                    src={post.profile_image}
                                    sx={{ width: 48, height: 48, mr: 2, cursor: 'pointer' }}
                                    onClick={() => handleProfileClick(post)}
                                />
                                <Box>
                                    <Typography
                                        variant="subtitle1"
                                        fontWeight="bold"
                                        sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                                        onClick={() => handleProfileClick(post)}
                                    >
                                        {post.username}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {post.designation}
                                    </Typography>
                                </Box>
                            </Box>

                            <Typography variant="body1" sx={{ mb: 2 }}>
                                {post.textPost}
                            </Typography>
                        </CardContent>

                        {post.filePost && (
                            <CardMedia
                                component="img"
                                image={post.filePost}
                                alt="Post content"
                                sx={{ maxHeight: 500, objectFit: 'contain', bgcolor: 'black' }}
                            />
                        )}
                        {/* Add interaction buttons here (Like, Comment, Share) if desired */}
                    </Card>
                ))}
            </Stack>

            {/* Load More Button */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 1 }}>
                {hasMore && (
                    <Button
                        variant="outlined"
                        onClick={loadMore}
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Load More'}
                    </Button>
                )}
                {!hasMore && posts.length > 0 && (
                    <Typography variant="body2" color="text.secondary">
                        No more posts to show.
                    </Typography>
                )}
            </Box>

            {/* Profile Dialog for Clicked User */}
            <ProfileDialog
                open={profileOpen}
                onClose={() => setProfileOpen(false)}
                user={selectedUser}
            />
        </Box>
    );
}

export default Middle;

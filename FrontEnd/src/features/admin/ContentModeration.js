import React, { useEffect, useState } from 'react';
import {
    Box,
    Container,
    Grid,
    Paper,
    Typography,
    Card,
    CardHeader,
    CardContent,
    CardMedia,
    Avatar,
    IconButton,
    InputAdornment,
    TextField,
    Skeleton
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Search as SearchIcon,
    Report as ReportIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import postApi from '../../api/postApi';
import adminApi from '../../api/adminApi';
import userApi from '../../api/userApi';
import Navbar from '../layout/Navbar';
import AdminSidebar from './AdminSidebar';
import Cookies from 'js-cookie';

function ContentModeration() {
    const [posts, setPosts] = useState([]);
    const [userMap, setUserMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const user = JSON.parse(localStorage.getItem('user') || Cookies.get('user') || '{}');

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await postApi.getAllPosts();
            const postsData = response.data?.data || [];
            setPosts(postsData);

            // Fetch user profiles for all unique userIds
            const uniqueUserIds = [...new Set(postsData.map(p => p.userId))].filter(Boolean);
            fetchUserProfiles(uniqueUserIds);
        } catch (error) {
            toast.error("Failed to load posts");
        } finally {
            setLoading(false);
        }
    };

    const fetchUserProfiles = async (userIds) => {
        const newUserMap = { ...userMap };
        let updated = false;

        await Promise.all(userIds.map(async (id) => {
            if (!newUserMap[id]) {
                try {
                    const response = await userApi.getProfile(id);
                    // Java userService returns ApiResponse<UserDto>
                    if (response.data?.data) {
                        newUserMap[id] = response.data.data;
                        updated = true;
                    }
                } catch (error) {
                    console.error(`Failed to fetch profile for user ${id}`, error);
                }
            }
        }));

        if (updated) {
            setUserMap(newUserMap);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this post?")) {
            try {
                await adminApi.deletePost(id);
                toast.success("Post removed");
                setPosts(prevPosts => prevPosts.filter(p => (p.postId || p.id) !== id));
            } catch (error) {
                toast.error("Failed to remove post");
            }
        }
    };

    const filteredPosts = Array.isArray(posts) ? posts.filter(p => {
        const postUser = userMap[p.userId] || {};
        const userName = `${postUser.firstName || ''} ${postUser.lastName || ''}`.toLowerCase();
        const search = searchTerm.toLowerCase();

        return userName.includes(search) ||
            p.username?.toLowerCase().includes(search) ||
            p.description?.toLowerCase().includes(search) ||
            p.title?.toLowerCase().includes(search);
    }) : [];

    return (
        <Box sx={{ minHeight: '100vh', pt: 12 }}>
            <Navbar userData={user} />
            <Container maxWidth="xl">
                <Grid container spacing={3}>
                    <Grid item xs={12} md={3}>
                        <AdminSidebar />
                    </Grid>
                    <Grid item xs={12} md={9}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>Content Moderation</Typography>
                            <TextField
                                placeholder="Search content or users..."
                                size="small"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: 'text.secondary' }} />
                                        </InputAdornment>
                                    ),
                                    sx: { borderRadius: '50px', background: 'rgba(255,255,255,0.05)' }
                                }}
                            />
                        </Box>

                        <Box sx={{ columns: { xs: 1, sm: 2 }, gap: 3 }}>
                            {loading ? (
                                [...Array(4)].map((_, index) => (
                                    <Card key={index} sx={{ breakInside: 'avoid', mb: 3, background: 'rgba(255,255,255,0.03)', borderRadius: '20px' }}>
                                        <CardHeader
                                            avatar={<Skeleton variant="circular" width={40} height={40} />}
                                            title={<Skeleton variant="text" width="40%" />}
                                            subheader={<Skeleton variant="text" width="20%" />}
                                        />
                                        <CardContent>
                                            <Skeleton variant="text" width="90%" />
                                            <Skeleton variant="text" width="70%" />
                                        </CardContent>
                                        <Skeleton variant="rectangular" height={200} />
                                    </Card>
                                ))
                            ) : (
                                filteredPosts.map((post) => {
                                    const postUser = userMap[post.userId] || {};
                                    const postId = post.postId || post.id;

                                    return (
                                        <Card key={postId} sx={{ breakInside: 'avoid', mb: 3, background: 'rgba(255,255,255,0.03)', borderRadius: '20px' }}>
                                            <CardHeader
                                                avatar={<Avatar src={postUser.profileImage} />}
                                                action={
                                                    <IconButton color="error" onClick={() => handleDelete(postId)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                }
                                                title={`${postUser.firstName || 'User'} ${postUser.lastName || ''}`}
                                                subheader={postUser.username ? `@${postUser.username}` : `ID: ${post.userId}`}
                                            />
                                            <CardContent>
                                                {post.title && <Typography variant="subtitle1" fontWeight={600} gutterBottom>{post.title}</Typography>}
                                                <Typography variant="body2" color="text.secondary">{post.description}</Typography>
                                            </CardContent>
                                            {post.mediaUrl && (
                                                <CardMedia
                                                    component="img"
                                                    image={post.mediaUrl}
                                                    alt="Post media"
                                                    sx={{ maxHeight: 400, objectFit: 'cover' }}
                                                />
                                            )}
                                        </Card>
                                    );
                                })
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default ContentModeration;

import React, { useState } from 'react';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Avatar,
    Box,
    CardActions,
    IconButton,
    Dialog,
    Skeleton,
    Button,
    Menu,
    MenuItem,
    TextField,
    DialogTitle,
    DialogContent,
    DialogActions,
    ListItemIcon
} from '@mui/material';
import {
    ThumbUpAlt as LikeIcon,
    ThumbUpOffAlt as LikeOutlinedIcon,
    Favorite as HeartIcon,
    Share as ShareIcon,
    MoreVert as MoreVertIcon,
    Edit as EditIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import postApi from '../../../api/postApi';

const FeedPost = ({ post, onProfileClick, onUpdate, onDelete, onUpdateMedia }) => {
    const [expanded, setExpanded] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [liked, setLiked] = useState(post.liked || false);
    const [likeCount, setLikeCount] = useState(post.likeCount || 0);
    const [showHeart, setShowHeart] = useState(false);

    // Menu & Edit State
    const [anchorEl, setAnchorEl] = useState(null);
    const [editOpen, setEditOpen] = useState(false);
    const [editData, setEditData] = useState({ title: post.title || '', description: post.description || '' });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(post.mediaUrl);

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleEditClick = () => {
        setEditData({ title: post.title || '', description: post.description || '' });
        setPreviewImage(post.mediaUrl);
        setSelectedFile(null);
        setEditOpen(true);
        handleMenuClose();
    };

    const handleDeleteClick = () => {
        if (onDelete) onDelete(post.postId);
        handleMenuClose();
    };

    const handleEditSave = () => {
        if (onUpdate) onUpdate(post.postId, editData);
        if (selectedFile && onUpdateMedia) onUpdateMedia(post.postId, selectedFile);
        setEditOpen(false);
    };

    const handleEditChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const toggleExpanded = () => setExpanded(!expanded);

    const handleLikeToggle = async () => {
        const originalLiked = liked;
        const originalCount = likeCount;

        // Optimistic UI update
        setLiked(!originalLiked);
        setLikeCount(prev => originalLiked ? prev - 1 : prev + 1);

        if (!originalLiked) {
            setShowHeart(true);
            setTimeout(() => setShowHeart(false), 1000);
        }

        try {
            if (originalLiked) {
                const response = await postApi.unlikePost(post.postId || post.id);
                const message = response.data?.data || response.data?.message || "Post unliked";
                toast.success(message);
            } else {
                const response = await postApi.likePost(post.postId || post.id);
                const message = response.data?.data || response.data?.message || "Post liked";
                toast.success(message);
            }
        } catch (error) {
            // Revert on error
            setLiked(originalLiked);
            setLikeCount(originalCount);
            console.error("Like toggle failed", error);
            const errorMessage = error.response?.data?.error || "Action failed";
            toast.error(errorMessage);
        }
    };

    const DESCRIPTION_LIMIT = 150;
    const shouldTruncate = post.description && post.description.length > DESCRIPTION_LIMIT;
    const displayDescription = expanded || !shouldTruncate
        ? post.description
        : post.description?.substring(0, DESCRIPTION_LIMIT) + "...";

    return (
        <>
            <Card
                component={motion.div}
                layout
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.01 }}
                sx={{ mb: 2, borderRadius: 3, boxShadow: 3, position: 'relative' }}
            >
                <CardContent sx={{ pb: 1 }}>
                    {/* Header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar
                            src={post.profile_image}
                            sx={{ width: 48, height: 48, mr: 2, cursor: 'pointer' }}
                            onClick={() => onProfileClick(post)}
                        />
                        <Box>
                            <Typography
                                variant="subtitle1"
                                fontWeight="bold"
                                sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                                onClick={() => onProfileClick(post)}
                            >
                                {post.username}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {post.designation}
                            </Typography>
                        </Box>
                        <Box sx={{ flexGrow: 1 }} />
                        {(onUpdate || onDelete) && (
                            <>
                                <IconButton onClick={handleMenuOpen}>
                                    <MoreVertIcon />
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                >
                                    {onUpdate && (
                                        <MenuItem onClick={handleEditClick}>
                                            <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
                                            Edit
                                        </MenuItem>
                                    )}
                                    {onDelete && (
                                        <MenuItem onClick={handleDeleteClick}>
                                            <ListItemIcon><DeleteIcon fontSize="small" /></ListItemIcon>
                                            Delete
                                        </MenuItem>
                                    )}
                                </Menu>
                            </>
                        )}
                    </Box>

                    {/* Title */}
                    {post.title && (
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            {post.title}
                        </Typography>
                    )}

                    {/* Description */}
                    <Typography variant="body1" color="text.primary" sx={{ mb: 1, whiteSpace: 'pre-line' }}>
                        {displayDescription}
                        {shouldTruncate && (
                            <Typography
                                component="span"
                                variant="body2"
                                color="primary"
                                onClick={toggleExpanded}
                                sx={{ cursor: 'pointer', ml: 1, fontWeight: 'bold' }}
                            >
                                {expanded ? "Show Less" : "View More"}
                            </Typography>
                        )}
                    </Typography>
                </CardContent>

                {/* Media with Shimmer */}
                {post.mediaUrl && (
                    <Box sx={{ position: 'relative', bgcolor: 'black', minHeight: 200, cursor: 'pointer' }} onClick={() => setPreviewOpen(true)}>
                        {!imageLoaded && (
                            <Skeleton variant="rectangular" width="100%" height={300} animation="wave" sx={{ position: 'absolute', top: 0, left: 0 }} />
                        )}
                        <CardMedia
                            component="img"
                            image={post.mediaUrl}
                            alt="Post content"
                            onLoad={() => setImageLoaded(true)}
                            sx={{
                                maxHeight: 500,
                                objectFit: 'contain',
                                display: imageLoaded ? 'block' : 'none',
                                width: '100%'
                            }}
                        />
                    </Box>
                )}

                {/* Heart Animation Overlay */}
                <AnimatePresence>
                    {showHeart && (
                        <Box
                            component={motion.div}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 0] }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 10,
                                pointerEvents: 'none'
                            }}
                        >
                            <HeartIcon sx={{ fontSize: 100, color: '#e91e63' }} />
                        </Box>
                    )}
                </AnimatePresence>

                {/* Actions */}
                <CardActions disableSpacing sx={{ borderTop: 1, borderColor: 'divider', px: 2 }}>
                    <IconButton onClick={handleLikeToggle} sx={{ color: liked ? "#e91e63" : "inherit" }}>
                        {liked ? <LikeIcon /> : <LikeOutlinedIcon />}
                    </IconButton>
                    <Typography variant="body2" color="text.secondary">
                        {likeCount > 0 ? `${likeCount} ${likeCount === 1 ? 'Like' : 'Likes'}` : 'Like'}
                    </Typography>

                    <Box sx={{ flexGrow: 1 }} />

                    <IconButton>
                        <ShareIcon />
                    </IconButton>
                    <Typography variant="body2" color="text.secondary">Share</Typography>
                </CardActions>
            </Card>

            {/* Image Preview Modal */}
            <Dialog
                open={previewOpen}
                onClose={() => setPreviewOpen(false)}
                maxWidth="lg"
                PaperProps={{
                    sx: { bgcolor: 'transparent', boxShadow: 'none' }
                }}
            >
                <img
                    src={post.mediaUrl}
                    alt="Full Preview"
                    style={{ maxWidth: '100%', maxHeight: '90vh', borderRadius: 8 }}
                    onClick={() => setPreviewOpen(false)}
                />
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Edit Post</DialogTitle>
                <DialogContent>
                    <Box sx={{ mb: 2, textAlign: 'center' }}>
                        {previewImage && (
                            <img
                                src={previewImage}
                                alt="Post Media"
                                style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8, marginBottom: 10 }}
                            />
                        )}
                        <Button
                            variant="outlined"
                            component="label"
                            fullWidth
                        >
                            {selectedFile ? "Change Image" : "Upload New Image"}
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </Button>
                    </Box>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="title"
                        label="Title"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={editData.title}
                        onChange={handleEditChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        name="description"
                        label="Description"
                        multiline
                        rows={4}
                        fullWidth
                        variant="outlined"
                        value={editData.description}
                        onChange={handleEditChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditOpen(false)}>Cancel</Button>
                    <Button onClick={handleEditSave} variant="contained" color="primary">Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default FeedPost;

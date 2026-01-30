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
    Button
} from '@mui/material';
import {
    ThumbUpAlt as LikeIcon,
    ThumbUpOffAlt as LikeOutlinedIcon,
    Share as ShareIcon,
    MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const FeedPost = ({ post, onProfileClick }) => {
    const [expanded, setExpanded] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [liked, setLiked] = useState(false);

    const toggleExpanded = () => setExpanded(!expanded);
    const handleLike = () => setLiked(!liked);

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
                sx={{ mb: 2, borderRadius: 3, boxShadow: 3 }}
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
                        <IconButton>
                            <MoreVertIcon />
                        </IconButton>
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

                {/* Actions */}
                <CardActions disableSpacing sx={{ borderTop: 1, borderColor: 'divider', px: 2 }}>
                    <IconButton onClick={handleLike} color={liked ? "primary" : "default"}>
                        {liked ? <LikeIcon /> : <LikeOutlinedIcon />}
                    </IconButton>
                    <Typography variant="body2" color="text.secondary">Like</Typography>

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
        </>
    );
};

export default FeedPost;

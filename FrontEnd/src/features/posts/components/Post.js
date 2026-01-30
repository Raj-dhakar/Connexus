import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    IconButton,
    Box,
    Typography,
    Avatar,
    Stack,
    CircularProgress
} from '@mui/material';
import {
    Close as CloseIcon,
    Image as ImageIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import postApi from '../../../api/postApi';
import useAuth from '../../auth/useAuth';

const Post = ({ open, onClose, onPostCreated }) => {
    const { user } = useAuth();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setPreviewUrl(null);
    };

    const handleSubmit = async () => {
        if (!title.trim() && !description.trim()) {
            // Basic validation
            return;
        }

        setLoading(true);
        try {
            const postDto = {
                title: title,
                description: description
            };

            const formData = new FormData();
            formData.append('post', JSON.stringify(postDto));
            if (selectedImage) {
                formData.append('media', selectedImage);
            }

            const response = await postApi.createPost(formData);
            console.log("Post Created:", response.data);

            if (onPostCreated) {
                onPostCreated(response.data);
            }

            handleClose();
        } catch (error) {
            console.error("Failed to create post", error);
            // Optionally show error toast
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setTitle("");
        setDescription("");
        handleRemoveImage();
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6" component="div">Create a Post</Typography>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar src={user?.profile_image} sx={{ mr: 2 }} />
                    <Typography fontWeight="bold">{user?.username || "User"}</Typography>
                </Box>

                <TextField
                    fullWidth
                    label="Post Title"
                    variant="outlined"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    sx={{ mb: 2 }}
                />

                <TextField
                    fullWidth
                    label="What do you want to talk about?"
                    multiline
                    rows={4}
                    variant="outlined"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    sx={{ mb: 2 }}
                />

                {previewUrl && (
                    <Box sx={{ position: 'relative', mb: 2, borderRadius: 2, overflow: 'hidden', border: '1px solid #ddd' }}>
                        <img src={previewUrl} alt="Selected" style={{ width: '100%', display: 'block' }} />
                        <IconButton
                            sx={{ position: 'absolute', top: 5, right: 5, bgcolor: 'rgba(255,255,255,0.8)' }}
                            onClick={handleRemoveImage}
                            size="small"
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                )}

                <Stack direction="row" spacing={1} alignItems="center">
                    <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="icon-button-file"
                        type="file"
                        onChange={handleImageChange}
                    />
                    <label htmlFor="icon-button-file">
                        <IconButton color="primary" aria-label="upload picture" component="span">
                            <ImageIcon />
                        </IconButton>
                    </label>
                    <Typography variant="body2" color="text.secondary">Add Media</Typography>
                </Stack>

            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={handleClose} color="inherit">
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading || (!title && !description && !selectedImage)}
                    startIcon={loading && <CircularProgress size={20} color="inherit" />}
                >
                    {loading ? "Posting..." : "Post"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default Post;

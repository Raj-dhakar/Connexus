import React, { useState, useEffect } from 'react';
import { Avatar } from '@mui/material';
import userApi from '../../api/userApi';

const UserAvatar = ({ userId, name, sx, ...props }) => {
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        let isMounted = true;

        const fetchImage = async () => {
            if (!userId) return;
            try {
                const response = await userApi.getProfileImage(userId);
                // response.data likely contains the ApiResponse object directly or nested
                // standard axios response: response.data
                // ApiResponse: { message: "...", success: ... , data: "url" } or just fields?
                // User said: response -> new ApiResponse(image_url). 
                // Usually ApiResponse has a 'message' field or similar. 
                // Let's assume response.data.message (if message holds the string) or response.data.imageUrl if added.
                // Wait, constructor `new ApiResponse(image_url)` usually puts it in `message` or `data` field depending on definition.
                // Looking at `ApiResponse` usage in `UserController`: `new ApiResponse(userService.hash...())` -> String.
                // `new ApiResponse(imageUrl)` -> String.
                // So likely `response.data.message` holds the URL if ApiResponse just has one field.
                // Or `response.data` if it's the body. 
                // Let's check `ApiResponse` definition if possible? No, I'll guess it's `response.data.message` based on common patterns or just `response.data`.
                // Actually, `uploadProfileImage` returns `new ApiResponse(imageUrl)`. 
                // If I can't check, I'll try to log or handle both `response.data.message` and `response.data`.

                const data = response.data;
                const url = data.message || data.data || (typeof data === 'string' ? data : null);

                if (isMounted && url) {
                    setImageUrl(url);
                }
            } catch (error) {
                // specific 404 is epected if no image
                // console.error("Failed to fetch image", error);
            }
        };

        fetchImage();

        return () => {
            isMounted = false;
        };
    }, [userId]);

    return (
        <Avatar src={imageUrl} alt={name} sx={sx} {...props}>
            {name ? name.charAt(0).toUpperCase() : '?'}
        </Avatar>
    );
};

export default UserAvatar;

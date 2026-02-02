import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Divider,
    Link,
    Skeleton,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    Refresh as RefreshIcon,
    Newspaper as NewspaperIcon,
    OpenInNew as OpenInNewIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

function RightBar() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const getNews = async () => {
        setRefreshing(true);
        try {
            // Fetching news related to IT Industry, Software Engineering, and Tech
            const query = encodeURIComponent('IT Industry OR "Software Engineering" OR "Artificial Intelligence"');
            const response = await fetch(`https://newsapi.org/v2/everything?q=${query}&sortBy=publishedAt&pageSize=6&apiKey=6046867fa79f4b379c70524289a2823b`);
            const json = await response.json();
            if (json.articles) {
                setNews(json.articles);
            }
        } catch (err) {
            console.error("Failed to fetch news", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        getNews();
    }, []);

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <Box
            sx={{
                height: 'calc(100vh - 120px)',
                position: 'sticky',
                top: 100,
                display: 'flex',
                flexDirection: 'column',
                gap: 2
            }}
        >
            <Box sx={{
                p: 3,
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                overflow: 'hidden'
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <NewspaperIcon sx={{ color: 'primary.main' }} />
                        <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.5px' }}>
                            Tech Pulse
                        </Typography>
                    </Box>
                    <Tooltip title="Refresh News">
                        <IconButton
                            size="small"
                            onClick={getNews}
                            disabled={refreshing}
                            sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                        >
                            <RefreshIcon sx={{ fontSize: 20, animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
                        </IconButton>
                    </Tooltip>
                </Box>

                <Box sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    pr: 1,
                    '&::-webkit-scrollbar': { width: '4px' },
                    '&::-webkit-scrollbar-track': { background: 'transparent' },
                    '&::-webkit-scrollbar-thumb': {
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '10px',
                        '&:hover': { background: 'rgba(255, 255, 255, 0.2)' }
                    }
                }}>
                    {loading ? (
                        [...Array(5)].map((_, i) => (
                            <Box key={i} sx={{ mb: 3 }}>
                                <Skeleton variant="text" width="40%" height={20} sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 1 }} />
                                <Skeleton variant="rectangular" height={60} sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: '12px' }} />
                            </Box>
                        ))
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {news.map((item, index) => (
                                <Box
                                    key={index}
                                    component={motion.div}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    sx={{
                                        mb: 3,
                                        position: 'relative',
                                        '&:last-child': { mb: 0 }
                                    }}
                                >
                                    <Link
                                        href={item.url}
                                        target="_blank"
                                        underline="none"
                                        sx={{
                                            display: 'block',
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                '& .title': { color: 'primary.main' },
                                                '& .arrow': { opacity: 1, transform: 'translateX(0)' }
                                            }
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                                            <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.65rem' }}>
                                                {item.source.name}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                                                {formatTime(item.publishedAt)}
                                            </Typography>
                                        </Box>
                                        <Typography
                                            className="title"
                                            variant="body2"
                                            sx={{
                                                color: 'text.primary',
                                                fontWeight: 500,
                                                lineHeight: 1.5,
                                                mb: 1,
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                transition: 'color 0.2s ease'
                                            }}
                                        >
                                            {item.title}
                                        </Typography>
                                        <OpenInNewIcon
                                            className="arrow"
                                            sx={{
                                                fontSize: 14,
                                                color: 'primary.main',
                                                position: 'absolute',
                                                bottom: 2,
                                                right: 0,
                                                opacity: 0,
                                                transform: 'translateX(-5px)',
                                                transition: 'all 0.2s ease'
                                            }}
                                        />
                                    </Link>
                                    {index < news.length - 1 && <Divider sx={{ mt: 2, borderColor: 'rgba(255,255,255,0.05)' }} />}
                                </Box>
                            ))}
                        </AnimatePresence>
                    )}
                </Box>

                <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        Powered by NewsAPI.org
                    </Typography>
                </Box>
            </Box>

            <style>
                {`
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                `}
            </style>
        </Box>
    );
}

export default RightBar;

import React, { useEffect, useState } from 'react';
import {
    Box,
    Container,
    Grid,
    Paper,
    Typography,
    CircularProgress,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Divider
} from '@mui/material';
import {
    People as PeopleIcon,
    PostAdd as PostAddIcon,
    Work as WorkIcon,
    TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import adminApi from '../../api/adminApi';
import Navbar from '../layout/Navbar';
import AdminSidebar from './AdminSidebar';
import Cookies from 'js-cookie';

function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user') || Cookies.get('user') || '{}');

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await adminApi.getAdminStats();
            setStats(response.data.data);
        } catch (error) {
            console.error("Failed to fetch admin stats", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
        </Box>
    );

    const StatCard = ({ title, value, icon, color }) => (
        <Paper
            sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'translateY(-5px)' }
            }}
        >
            <Avatar sx={{ bgcolor: `${color}.main`, width: 56, height: 56, mb: 2 }}>
                {icon}
            </Avatar>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>{value}</Typography>
            <Typography variant="body2" color="text.secondary">{title}</Typography>
        </Paper>
    );

    return (
        <Box sx={{ minHeight: '100vh', pt: 12 }}>
            <Navbar userData={user} />
            <Container maxWidth="xl">
                <Grid container spacing={3}>
                    <Grid item xs={12} md={3}>
                        <AdminSidebar />
                    </Grid>
                    <Grid item xs={12} md={9}>
                        <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
                            Platform Overview
                        </Typography>

                        <Grid container spacing={3} sx={{ mb: 4 }}>
                            <Grid item xs={12} sm={6} md={3}>
                                <StatCard title="Total Users" value={stats?.totalUsers} icon={<PeopleIcon />} color="primary" />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <StatCard title="Recruiters" value={stats?.totalRecruiters} icon={<WorkIcon />} color="secondary" />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <StatCard title="Total Posts" value={stats?.totalPosts} icon={<PostAddIcon />} color="success" />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <StatCard title="Engagement" value="12%" icon={<TrendingUpIcon />} color="warning" />
                            </Grid>
                        </Grid>

                        <Paper sx={{ p: 4, background: 'rgba(255, 255, 255, 0.03)', borderRadius: '24px' }}>
                            <Typography variant="h6" sx={{ mb: 3 }}>Recent User Activity</Typography>
                            <List>
                                {stats?.recentUsers?.map((u, index) => (
                                    <React.Fragment key={u.id}>
                                        <ListItem>
                                            <ListItemAvatar>
                                                <Avatar src={u.profileImage} />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={`${u.firstName} ${u.lastName}`}
                                                secondary={`${u.username} • Joined with role ${u.role}`}
                                            />
                                            <Typography variant="caption" color="text.secondary">
                                                ID: #{u.id}
                                            </Typography>
                                        </ListItem>
                                        {index < (stats.recentUsers.length - 1) && <Divider variant="inset" component="li" />}
                                    </React.Fragment>
                                ))}
                            </List>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default AdminDashboard;

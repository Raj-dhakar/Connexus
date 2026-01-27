import React, { useEffect, useState } from 'react';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Box,
    Avatar,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Tooltip,
    CircularProgress
} from '@mui/material';
import {
    Visibility as VisibilityIcon,
    Email as EmailIcon,
    Work as WorkIcon,
    TrendingUp as TrendingUpIcon,
    People as PeopleIcon
} from '@mui/icons-material';
import userApi from '../../api/userApi';
import useAuth from '../auth/useAuth';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer
} from 'recharts';

function RecruiterDashboard() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    // Dummy data for charts
    const data = [
        { name: 'Mon', applications: 40, views: 240 },
        { name: 'Tue', applications: 30, views: 139 },
        { name: 'Wed', applications: 20, views: 980 },
        { name: 'Thu', applications: 27, views: 390 },
        { name: 'Fri', applications: 18, views: 480 },
        { name: 'Sat', applications: 23, views: 380 },
        { name: 'Sun', applications: 34, views: 430 },
    ];

    useEffect(() => {

        const fetchUsers = async () => {
            try {
                const response = await userApi.getAllUsers();
                if (response.data && response.data.data) {
                    // Filter out recruiters if needed, or just show all candidates
                    const candidates = response.data.data.filter(u => u.role !== "RECRUITER");
                    setUsers(candidates);
                }
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [user, navigate]);

    if (loading) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress color="secondary" />
            </Box>
        );
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <Box sx={{ minHeight: '100vh', pt: 12, pb: 4 }}>
            <Container maxWidth="xl" component={motion.div} variants={containerVariants} initial="hidden" animate="visible">
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h3" sx={{ fontWeight: 800, background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Dashboard
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Welcome back, {user?.username}. Here's what's happening.
                    </Typography>
                </Box>

                {/* Stats Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {[
                        { label: 'Total Candidates', value: users.length, icon: <PeopleIcon />, color: '#00f2fe' },
                        { label: 'Active Jobs', value: '12', icon: <WorkIcon />, color: '#4facfe' },
                        { label: 'Profile Views', value: '1.2k', icon: <VisibilityIcon />, color: '#f093fb' },
                        { label: 'Growth', value: '+24%', icon: <TrendingUpIcon />, color: '#30cfd0' },
                    ].map((stat, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Paper
                                component={motion.div}
                                variants={itemVariants}
                                sx={{ p: 3, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', overflow: 'hidden', position: 'relative' }}
                            >
                                <Box>
                                    <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
                                    <Typography variant="h4" fontWeight="bold" sx={{ color: '#fff' }}>{stat.value}</Typography>
                                </Box>
                                <Box sx={{
                                    p: 1.5,
                                    borderRadius: '50%',
                                    background: `rgba(${parseInt(stat.color.slice(1, 3), 16)}, ${parseInt(stat.color.slice(3, 5), 16)}, ${parseInt(stat.color.slice(5, 7), 16)}, 0.1)`,
                                    color: stat.color
                                }}>
                                    {stat.icon}
                                </Box>
                                {/* Glow effect */}
                                <Box sx={{ position: 'absolute', top: -20, right: -20, width: 60, height: 60, borderRadius: '50%', background: stat.color, filter: 'blur(40px)', opacity: 0.3 }} />
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                {/* Charts & candidates */}
                <Grid container spacing={3}>
                    <Grid item xs={12} lg={8}>
                        <Paper component={motion.div} variants={itemVariants} sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" fontWeight="bold" mb={3}>Application Trends</Typography>
                            <Box sx={{ height: 300, width: '100%' }}>
                                <ResponsiveContainer>
                                    <AreaChart data={data}>
                                        <defs>
                                            <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#00f2fe" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#00f2fe" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#4facfe" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#4facfe" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" />
                                        <YAxis stroke="rgba(255,255,255,0.3)" />
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                        <RechartsTooltip
                                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                        />
                                        <Area type="monotone" dataKey="applications" stroke="#00f2fe" fillOpacity={1} fill="url(#colorApps)" />
                                        <Area type="monotone" dataKey="views" stroke="#4facfe" fillOpacity={1} fill="url(#colorViews)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </Box>
                        </Paper>

                        <Paper component={motion.div} variants={itemVariants} sx={{ p: 0, overflow: 'hidden' }}>
                            <Box sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight="bold">Recent Candidates</Typography>
                            </Box>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ '& th': { borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'text.secondary' } }}>
                                            <TableCell>Candidate</TableCell>
                                            <TableCell>Role</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell align="right">Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {users.slice(0, 5).map((u) => (
                                            <TableRow key={u.id} sx={{ '& td': { borderBottom: '1px solid rgba(255,255,255,0.05)' }, '&:hover': { backgroundColor: 'rgba(255,255,255,0.02)' } }}>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Avatar src={u.profile_image} />
                                                        <Box>
                                                            <Typography variant="body2" fontWeight="bold">{u.username}</Typography>
                                                            <Typography variant="caption" color="text.secondary">{u.email}</Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>Senior Developer</TableCell>
                                                <TableCell>
                                                    <Chip label="Applied" size="small" sx={{ backgroundColor: 'rgba(0, 242, 254, 0.1)', color: '#00f2fe', borderRadius: '4px' }} />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Tooltip title="View Profile">
                                                        <IconButton size="small"><VisibilityIcon fontSize="small" /></IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Contact">
                                                        <IconButton size="small"><EmailIcon fontSize="small" /></IconButton>
                                                    </Tooltip>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Grid>

                    {/* Right column (Calendar, Notifications, etc.) could go here */}
                </Grid>
            </Container>
        </Box>
    );
}

export default RecruiterDashboard;

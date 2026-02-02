import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Box,
    Container,
    Grid,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Avatar,
    IconButton,
    Chip,
    TextField,
    InputAdornment,
    Skeleton
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Search as SearchIcon,
    Block as BlockIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import adminApi from '../../api/adminApi';
import Navbar from '../layout/Navbar';
import AdminSidebar from './AdminSidebar';
import Cookies from 'js-cookie';

function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const location = useLocation();
    const isRecruiterView = location.pathname === '/admin/recruiters';
    const user = JSON.parse(Cookies.get('user') || '{}');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await adminApi.getAdminUsers();
            setUsers(response.data.data);
        } catch (error) {
            toast.error("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user? This action is irreversible.")) {
            try {
                await adminApi.deleteUser(id);
                toast.success("User deleted successfully");
                setUsers(prevUsers => prevUsers.filter(u => u.id !== id));
            } catch (error) {
                toast.error("Failed to delete user");
            }
        }
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email?.toLowerCase().includes(searchTerm.toLowerCase());

        if (isRecruiterView) {
            return matchesSearch && u.role === 'ROLE_RECRUITER';
        }
        return matchesSearch;
    });

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
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                {isRecruiterView ? 'Recruiter Management' : 'User Management'}
                            </Typography>
                            <TextField
                                placeholder={isRecruiterView ? "Search recruiters..." : "Search users..."}
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

                        <TableContainer component={Paper} sx={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: '24px' }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>User</TableCell>
                                        <TableCell>Role</TableCell>
                                        <TableCell>Designation</TableCell>
                                        <TableCell>Location</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading ? (
                                        [...Array(5)].map((_, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Skeleton variant="circular" width={40} height={40} />
                                                        <Box sx={{ width: '100%' }}>
                                                            <Skeleton variant="text" width="60%" />
                                                            <Skeleton variant="text" width="40%" />
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell><Skeleton variant="rectangular" width={60} height={24} sx={{ borderRadius: '4px' }} /></TableCell>
                                                <TableCell><Skeleton variant="text" width="80%" /></TableCell>
                                                <TableCell><Skeleton variant="text" width="80%" /></TableCell>
                                                <TableCell align="right">
                                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                                        <Skeleton variant="circular" width={32} height={32} />
                                                        <Skeleton variant="circular" width={32} height={32} />
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        filteredUsers.map((u) => (
                                            <TableRow key={u.id} hover>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Avatar src={u.profileImage} />
                                                        <Box>
                                                            <Typography variant="body2" fontWeight={600}>{u.firstName} {u.lastName}</Typography>
                                                            <Typography variant="caption" color="text.secondary">{u.email}</Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={u.role?.replace('ROLE_', '')}
                                                        color={u.role === 'ROLE_RECRUITER' ? 'secondary' : 'primary'}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                </TableCell>
                                                <TableCell>{u.designation || 'N/A'}</TableCell>
                                                <TableCell>{u.location || 'N/A'}</TableCell>
                                                <TableCell align="right">
                                                    <IconButton size="small" color="error" onClick={() => handleDelete(u.id)}>
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                    <IconButton size="small">
                                                        <BlockIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default UserManagement;

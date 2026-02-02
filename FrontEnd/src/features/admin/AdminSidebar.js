import React from 'react';
import {
    Paper,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
    Divider
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    PeopleAlt as PeopleAltIcon,
    VerifiedUser as VerifiedUserIcon,
    ReportProblem as ReportProblemIcon,
    Settings as SettingsIcon,
    ExitToApp as ExitToAppIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

function AdminSidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
        { text: 'Manage Users', icon: <PeopleAltIcon />, path: '/admin/users' },
        { text: 'Recruiters', icon: <VerifiedUserIcon />, path: '/admin/recruiters' },
        { text: 'Moderation', icon: <ReportProblemIcon />, path: '/admin/moderation' },
    ];

    const handleLogout = () => {
        Cookies.remove('token');
        Cookies.remove('user');
        navigate('/');
    };

    return (
        <Paper
            sx={{
                p: 2,
                height: 'fit-content',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '24px'
            }}
        >
            <Typography variant="overline" sx={{ px: 2, color: 'text.secondary', fontWeight: 700 }}>
                Administration
            </Typography>
            <List>
                {menuItems.map((item) => (
                    <ListItem
                        button
                        key={item.text}
                        onClick={() => navigate(item.path)}
                        sx={{
                            borderRadius: '12px',
                            mb: 0.5,
                            bgcolor: location.pathname === item.path ? 'primary.main' : 'transparent',
                            color: location.pathname === item.path ? 'primary.contrastText' : 'text.primary',
                            '&:hover': {
                                bgcolor: location.pathname === item.path ? 'primary.main' : 'rgba(255,255,255,0.05)'
                            }
                        }}
                    >
                        <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
            <Divider sx={{ my: 2 }} />
            <List>

                <ListItem button onClick={handleLogout} sx={{ borderRadius: '12px', color: 'error.main' }}>
                    <ListItemIcon><ExitToAppIcon sx={{ color: 'error.main' }} /></ListItemIcon>
                    <ListItemText primary="Logout Admin" />
                </ListItem>
            </List>
        </Paper>
    );
}

export default AdminSidebar;

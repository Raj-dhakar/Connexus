import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Avatar,
    IconButton,
    InputBase,
    useTheme,
    useMediaQuery,
    Menu,
    MenuItem,
    Tooltip,
    Paper
} from '@mui/material';
import {
    Search as SearchIcon,
    Home as HomeIcon,
    People as PeopleIcon,
    Message as MessageIcon,
    Logout as LogoutIcon,
    Menu as MenuIcon,
    Notifications as NotificationsIcon
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { motion } from 'framer-motion';

function Navbar({ userData }) {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [anchorElUser, setAnchorElUser] = useState(null);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const logout = () => {
        Cookies.remove("user");
        Cookies.remove("token");
        navigate("/");
    };

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { label: 'Home', icon: <HomeIcon />, path: '/main' },
        { label: 'Network', icon: <PeopleIcon />, path: '/network', state: { currentUserProImg: userData?.profile_image, currentUserName: userData?.username } },
        { label: 'Messaging', icon: <MessageIcon />, path: '/message', state: { currentUserProImg: userData?.profile_image, currentUserName: userData?.username } },
    ];

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', position: 'fixed', top: 20, left: 0, right: 0, zIndex: 1100, pointerEvents: 'none' }}>
            <Paper
                component={motion.div}
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                elevation={4}
                sx={{
                    pointerEvents: 'auto',
                    borderRadius: '50px',
                    backgroundColor: 'rgba(15, 23, 42, 0.6) !important', // Glass overrides
                    backdropFilter: 'blur(20px) !important',
                    border: '1px solid rgba(255, 255, 255, 0.1) !important',
                    padding: '5px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    minWidth: { xs: '90%', md: '600px' },
                    justifyContent: 'space-between',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
                }}
            >
                {/* Logo */}
                <Typography
                    variant="h6"
                    component={Link}
                    to="/main"
                    sx={{
                        fontWeight: 800,
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textDecoration: 'none',
                        letterSpacing: '-0.5px',
                        mr: 2
                    }}
                >
                    Connexus
                </Typography>

                {/* Desktop Nav Items */}
                {!isMobile && (
                    <Box sx={{ display: 'flex', gap: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '30px', padding: '5px' }}>
                        {navItems.map((item) => (
                            <Tooltip title={item.label} key={item.label}>
                                <IconButton
                                    component={Link}
                                    to={item.path}
                                    state={item.state}
                                    sx={{
                                        color: isActive(item.path) ? theme.palette.primary.main : 'rgba(255,255,255,0.5)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            color: theme.palette.primary.light,
                                            transform: 'translateY(-2px)'
                                        },
                                        position: 'relative'
                                    }}
                                >
                                    {item.icon}
                                    {isActive(item.path) && (
                                        <Box
                                            component={motion.div}
                                            layoutId="activeTab"
                                            sx={{
                                                position: 'absolute',
                                                bottom: -2,
                                                width: '4px',
                                                height: '4px',
                                                borderRadius: '50%',
                                                backgroundColor: theme.palette.primary.main
                                            }}
                                        />
                                    )}
                                </IconButton>
                            </Tooltip>
                        ))}
                    </Box>
                )}

                {/* Right Actions */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton sx={{ color: 'text.secondary' }}>
                        <SearchIcon />
                    </IconButton>

                    <Tooltip title="Account">
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, border: `2px solid ${theme.palette.primary.main}` }}>
                            <Avatar
                                alt={userData?.username}
                                src={userData?.profile_image}
                                sx={{ width: 32, height: 32 }}
                            />
                        </IconButton>
                    </Tooltip>

                    {/* Mobile Menu Toggle */}
                    {isMobile && (
                        <IconButton onClick={handleOpenUserMenu} sx={{ color: 'text.primary' }}>
                            <MenuIcon />
                        </IconButton>
                    )}
                </Box>

                {/* User Menu */}
                <Menu
                    sx={{ mt: '45px', '& .MuiPaper-root': { borderRadius: '16px', background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' } }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    keepMounted
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                >
                    {isMobile && navItems.map((item) => (
                        <MenuItem key={item.label} component={Link} to={item.path} state={item.state} onClick={handleCloseUserMenu}>
                            <Typography textAlign="center" sx={{ color: 'text.primary' }}>{item.label}</Typography>
                        </MenuItem>
                    ))}
                    <MenuItem onClick={logout}>
                        <LogoutIcon sx={{ mr: 1, fontSize: 20, color: theme.palette.error.main }} />
                        <Typography textAlign="center" color="error">Logout</Typography>
                    </MenuItem>
                </Menu>
            </Paper>
        </Box>
    );
}

export default Navbar;

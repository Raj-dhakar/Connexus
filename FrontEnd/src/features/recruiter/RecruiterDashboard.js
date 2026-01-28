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
    CircularProgress,
    TablePagination,
    Autocomplete,
    TextField
} from '@mui/material';
import {
    Visibility as VisibilityIcon,
    Email as EmailIcon,
    Work as WorkIcon,
    TrendingUp as TrendingUpIcon,
    People as PeopleIcon,
    Search as SearchIcon
} from '@mui/icons-material';
import userApi from '../../api/userApi';
import useAuth from '../auth/useAuth';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

function RecruiterDashboard() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [selectedLocations, setSelectedLocations] = useState([]);
    const [selectedExperience, setSelectedExperience] = useState([]);

    const [skillOptions, setSkillOptions] = useState([]);
    const [locationOptions, setLocationOptions] = useState([]);
    const [skillInput, setSkillInput] = useState("");
    const [locationInput, setLocationInput] = useState("");

    const EXPERIENCES = ["Junior", "Mid-Level", "Senior", "Lead", "Manager"];

    // Debounce utility
    const useDebounce = (value, delay) => {
        const [debouncedValue, setDebouncedValue] = useState(value);
        useEffect(() => {
            const handler = setTimeout(() => {
                setDebouncedValue(value);
            }, delay);
            return () => {
                clearTimeout(handler);
            };
        }, [value, delay]);
        return debouncedValue;
    };

    const debouncedSkillInput = useDebounce(skillInput, 500);
    const debouncedLocationInput = useDebounce(locationInput, 500);

    useEffect(() => {
        const fetchSkills = async () => {
            if (!debouncedSkillInput) return;
            try {
                const response = await axios.get(`https://api.stackexchange.com/2.3/tags?order=desc&sort=popular&site=stackoverflow&inname=${debouncedSkillInput}`);
                if (response.data && response.data.items) {
                    setSkillOptions(response.data.items.map(item => item.name));
                }
            } catch (error) {
                console.error("Error fetching skills:", error);
            }
        };
        fetchSkills();
    }, [debouncedSkillInput]);

    useEffect(() => {
        const fetchLocations = async () => {
            if (!debouncedLocationInput) return;
            try {
                const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${debouncedLocationInput}`);
                if (response.data) {
                    setLocationOptions(response.data.map(item => item.display_name));
                }
            } catch (error) {
                console.error("Error fetching locations:", error);
            }
        };
        fetchLocations();
    }, [debouncedLocationInput]);

    useEffect(() => {

        const fetchUsers = async () => {
            try {
                const response = await userApi.getAllUsers();
                if (response.data && response.data.data) {
                    const candidates = response.data.data
                        .filter(u => u.role !== "RECRUITER")
                        .map(u => ({
                            ...u,
                            // Inject dummy data for demo purposes
                            skills: ["React", "Node.js", "Java"].sort(() => 0.5 - Math.random()).slice(0, 2),
                            location: ["New York", "London", "Remote"][Math.floor(Math.random() * 3)],
                            experience: ["Junior", "Senior"][Math.floor(Math.random() * 2)]
                        }));
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

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const toggleFilter = (item, list, setList) => {
        if (list.includes(item)) {
            setList(list.filter(i => i !== item));
        } else {
            setList([...list, item]);
        }
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (u.firstName && u.firstName.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (u.lastName && u.lastName.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesSkills = selectedSkills.length === 0 ||
            selectedSkills.some(selected =>
                u.skills && u.skills.some(userSkill => userSkill.toLowerCase() === selected.toLowerCase())
            );

        const matchesLocation = selectedLocations.length === 0 ||
            (u.location && selectedLocations.some(selected =>
                u.location.toLowerCase().includes(selected.split(',')[0].toLowerCase())
            ));

        const matchesExperience = selectedExperience.length === 0 ||
            (u.experience && selectedExperience.includes(u.experience));

        return matchesSearch && matchesSkills && matchesLocation && matchesExperience;
    });

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
                        Welcome back, {user?.username}. Find your next top talent.
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

                {/* Filtering Section */}
                <Paper component={motion.div} variants={itemVariants} sx={{ p: 4, mb: 4, background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <Grid container spacing={4}>
                        {/* Search Bar */}
                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', px: 2, border: '1px solid rgba(255,255,255,0.05)' }}>
                                <IconButton disabled>
                                    <SearchIcon sx={{ color: 'text.secondary' }} />
                                </IconButton>
                                <input
                                    type="text"
                                    placeholder="Search candidates by name, email, or role..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{
                                        width: '100%',
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#fff',
                                        padding: '16px',
                                        fontSize: '1rem',
                                        outline: 'none'
                                    }}
                                />
                            </Box>
                        </Grid>

                        {/* Filters */}
                        <Grid item xs={12}>
                            <Grid container spacing={3}>
                                {/* Skills */}
                                <Grid item xs={12} md={4}>
                                    <Typography variant="subtitle2" color="text.secondary" mb={2}>SKILLS</Typography>
                                    <Autocomplete
                                        multiple
                                        options={skillOptions}
                                        value={selectedSkills}
                                        onChange={(event, newValue) => setSelectedSkills(newValue)}
                                        onInputChange={(event, newInputValue) => setSkillInput(newInputValue)}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="Select Skills"
                                                variant="outlined"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        color: '#fff',
                                                        '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                                        '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
                                                    }
                                                }}
                                            />
                                        )}
                                        renderTags={(value, getTagProps) =>
                                            value.map((option, index) => (
                                                <Chip
                                                    label={option}
                                                    {...getTagProps({ index })}
                                                    sx={{
                                                        bgcolor: 'rgba(0, 242, 254, 0.2)',
                                                        color: '#00f2fe',
                                                        border: '1px solid rgba(0, 242, 254, 0.3)'
                                                    }}
                                                />
                                            ))
                                        }
                                    />
                                </Grid>

                                {/* Location */}
                                <Grid item xs={12} md={4}>
                                    <Typography variant="subtitle2" color="text.secondary" mb={2}>LOCATION</Typography>
                                    <Autocomplete
                                        multiple
                                        options={locationOptions}
                                        value={selectedLocations}
                                        onChange={(event, newValue) => setSelectedLocations(newValue)}
                                        onInputChange={(event, newInputValue) => setLocationInput(newInputValue)}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                placeholder="Select Location"
                                                variant="outlined"
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        color: '#fff',
                                                        '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                                                        '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.4)' },
                                                    }
                                                }}
                                            />
                                        )}
                                        renderTags={(value, getTagProps) =>
                                            value.map((option, index) => (
                                                <Chip
                                                    label={option}
                                                    {...getTagProps({ index })}
                                                    sx={{
                                                        bgcolor: 'rgba(79, 172, 254, 0.2)',
                                                        color: '#4facfe',
                                                        border: '1px solid rgba(79, 172, 254, 0.3)'
                                                    }}
                                                />
                                            ))
                                        }
                                    />
                                </Grid>

                                {/* Experience */}
                                <Grid item xs={12} md={4}>
                                    <Typography variant="subtitle2" color="text.secondary" mb={2}>EXPERIENCE</Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {EXPERIENCES.map(exp => (
                                            <Chip
                                                key={exp}
                                                label={exp}
                                                onClick={() => toggleFilter(exp, selectedExperience, setSelectedExperience)}
                                                sx={{
                                                    backgroundColor: selectedExperience.includes(exp) ? '#f093fb' : 'rgba(255,255,255,0.05)',
                                                    color: selectedExperience.includes(exp) ? '#000' : 'text.secondary',
                                                    border: selectedExperience.includes(exp) ? 'none' : '1px solid rgba(255,255,255,0.1)',
                                                    '&:hover': { backgroundColor: selectedExperience.includes(exp) ? '#d870e4' : 'rgba(255,255,255,0.1)' }
                                                }}
                                            />
                                        ))}
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>

                {/* candidates */}
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper component={motion.div} variants={itemVariants} sx={{ p: 0, overflow: 'hidden' }}>
                            <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6" fontWeight="bold">Recent Candidates</Typography>
                                <Typography variant="caption" color="text.secondary">Showing {filteredUsers.length} candidates</Typography>
                            </Box>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ '& th': { borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'text.secondary' } }}>
                                            <TableCell>Candidate</TableCell>
                                            <TableCell>Email</TableCell>
                                            <TableCell>Role</TableCell>
                                            <TableCell align="right">Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {filteredUsers
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((u) => (
                                                <TableRow key={u.id} sx={{ '& td': { borderBottom: '1px solid rgba(255,255,255,0.05)' }, '&:hover': { backgroundColor: 'rgba(255,255,255,0.02)' } }}>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                            <Avatar src={u.profile_image} alt={u.firstName} />
                                                            <Typography variant="body2" fontWeight="bold">
                                                                {u.firstName && u.lastName ? `${u.firstName} ${u.lastName}` : u.username}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Box>
                                                            <Typography variant="body2" color="text.secondary">{u.email}</Typography>
                                                            <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                                                                {u.skills && u.skills.map(skill => (
                                                                    <Chip key={skill} label={skill} size="small" sx={{ fontSize: '0.65rem', height: 20 }} />
                                                                ))}
                                                            </Box>
                                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                                                {u.location}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={u.role === 'ROLE_RECRUITER' ? 'Recruiter' : 'Candidate'}
                                                            size="small"
                                                            sx={{
                                                                backgroundColor: u.role === 'ROLE_RECRUITER' ? 'rgba(79, 172, 254, 0.1)' : 'rgba(0, 242, 254, 0.1)',
                                                                color: u.role === 'ROLE_RECRUITER' ? '#4facfe' : '#00f2fe',
                                                                borderRadius: '4px'
                                                            }}
                                                        />
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
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={users.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                sx={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
                            />
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default RecruiterDashboard;

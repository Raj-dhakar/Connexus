import React from 'react';
import Sidebar from './Sidebar';
import Middle from '../posts/components/Middle';
import { Grid, Container, Box } from '@mui/material';
import RightBar from './RightBar';
import { motion } from 'framer-motion';

function Home({ userData }) {
    return (
        <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            sx={{ backgroundColor: 'transparent', minHeight: '100%', pt: 12, pb: 4 }}
        >
            <Container maxWidth="xl">
                <Grid container spacing={3} component={motion.div} initial="hidden" animate="visible" variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.2
                        }
                    }
                }}>
                    {/* Left Sidebar - Profile/Menu */}
                    <Grid item xs={12} md={3} sx={{ display: { xs: 'none', md: 'block' } }} component={motion.div} variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
                        <Sidebar userData={userData} />
                    </Grid>

                    {/* Middle - Feed */}
                    <Grid item xs={12} md={6} lg={6} component={motion.div} variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
                        <Middle userData={userData} />
                    </Grid>

                    {/* Right Sidebar - News/Ads */}
                    <Grid item xs={12} md={3} lg={3} sx={{ display: { xs: 'none', md: 'none', lg: 'block' } }} component={motion.div} variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
                        <RightBar />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default Home;

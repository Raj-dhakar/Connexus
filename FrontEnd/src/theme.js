import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#00f2fe',
            contrastText: '#0a0e17',
        },
        secondary: {
            main: '#4facfe',
            contrastText: '#ffffff',
        },
        background: {
            default: '#0F172A',
            paper: 'rgba(255, 255, 255, 0.05)',
        },
        text: {
            primary: '#f8fafc',
            secondary: '#94a3b8',
        },
        action: {
            hover: 'rgba(0, 242, 254, 0.08)',
        },
        divider: 'rgba(255, 255, 255, 0.1)',
    },
    typography: {
        fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
        h1: { fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 },
        h2: { fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 },
        h3: { fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 },
        h4: { fontFamily: "'Outfit', sans-serif", fontWeight: 600 },
        h5: { fontFamily: "'Outfit', sans-serif", fontWeight: 500 },
        h6: { fontFamily: "'Outfit', sans-serif", fontWeight: 500 },
        button: { fontFamily: "'Outfit', sans-serif", fontWeight: 600, textTransform: 'none' },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    background: 'linear-gradient(135deg, #0F172A 0%, #0a0e17 100%)',
                    overflowX: 'hidden',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backdropFilter: 'blur(16px)',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
                    borderRadius: '16px',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                        // transform: 'translateY(-2px)', // Subtle lift on hover globally might be too much, applied selectively instead
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '50px',
                    padding: '8px 24px',
                    boxShadow: '0 4px 14px 0 rgba(0, 242, 254, 0.3)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(0, 242, 254, 0.5)',
                    },
                },
                containedPrimary: {
                    background: 'linear-gradient(45deg, #00f2fe 30%, #4facfe 90%)',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        backgroundColor: 'rgba(0, 0, 0, 0.2)',
                        backdropFilter: 'blur(5px)',
                        '& fieldset': {
                            borderColor: 'rgba(255, 255, 255, 0.1)',
                        },
                        '&:hover fieldset': {
                            borderColor: 'rgba(0, 242, 254, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#00f2fe',
                            boxShadow: '0 0 0 4px rgba(0, 242, 254, 0.1)',
                        },
                    },
                    '& input': {
                        color: '#fff',
                    },
                    '& label': {
                        color: '#94a3b8',
                    },
                    '& label.Mui-focused': {
                        color: '#00f2fe',
                    },
                },
            },
        },
    },
});

export default theme;

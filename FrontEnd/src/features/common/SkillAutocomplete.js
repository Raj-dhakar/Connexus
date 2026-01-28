import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, Chip, CircularProgress } from '@mui/material';
import axios from 'axios';

// Hook for debouncing input
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

const SkillAutocomplete = ({ value, onChange, label = "Skills" }) => {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [inputValue, setInputValue] = useState("");

    // Use local state for options if value is provided so we don't lose current selections
    // But options come from API search. 

    const debouncedInput = useDebounce(inputValue, 500);

    useEffect(() => {
        const fetchSkills = async () => {
            if (!debouncedInput) return;
            setLoading(true);
            try {
                // Using StackExchange API as in RecruiterDashboard
                const response = await axios.get(`https://api.stackexchange.com/2.3/tags?order=desc&sort=popular&site=stackoverflow&inname=${debouncedInput}`);
                if (response.data && response.data.items) {
                    setOptions(response.data.items.map(item => item.name));
                }
            } catch (error) {
                console.error("Error fetching skills:", error);
            } finally {
                setLoading(false);
            }
        };

        if (debouncedInput.length > 1) {
            fetchSkills();
        }
    }, [debouncedInput]);

    return (
        <Autocomplete
            multiple
            freeSolo // Allow users to enter custom skills if not found
            options={options}
            loading={loading}
            value={value || []}
            onChange={(event, newValue) => onChange(newValue)}
            onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    placeholder="Add skills (e.g. React, Java)"
                    variant="outlined"
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }}
                />
            )}
            renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => (
                    <Chip
                        label={option}
                        {...getTagProps({ index })}
                        color="primary"
                        variant="outlined"
                    />
                ))
            }
        />
    );
};

export default SkillAutocomplete;

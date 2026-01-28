import React, { useState, useEffect } from 'react';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';
import axios from 'axios';

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

const LocationAutocomplete = ({ value, onChange, label = "Location" }) => {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [inputValue, setInputValue] = useState("");

    const debouncedInput = useDebounce(inputValue, 500);

    useEffect(() => {
        const fetchLocations = async () => {
            if (!debouncedInput) return;
            setLoading(true);
            try {
                // Using Nominatim API
                const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${debouncedInput}`);
                if (response.data) {
                    setOptions(response.data.map(item => item.display_name));
                }
            } catch (error) {
                console.error("Error fetching locations:", error);
            } finally {
                setLoading(false);
            }
        };

        if (debouncedInput.length > 2) {
            fetchLocations();
        }
    }, [debouncedInput]);

    return (
        <Autocomplete
            freeSolo
            options={options}
            loading={loading}
            // For single value selection (profile location constitutes one string)
            value={value || null}
            onChange={(event, newValue) => {
                // newValue can be null, a string (if freeSolo typed), or an option string
                onChange(newValue);
            }}
            onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    placeholder="Search city, country..."
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
        />
    );
};

export default LocationAutocomplete;

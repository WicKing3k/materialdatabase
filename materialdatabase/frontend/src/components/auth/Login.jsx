import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useIntl } from 'react-intl';
import {
    TextField,
    Button,
    Paper,
    Typography,
    Container
} from '@material-ui/core';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const intl = useIntl();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(formData);
            navigate('/materials');
        } catch (error) {
            setError(error.response?.data?.message || 'Login failed');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <Container maxWidth="sm">
            <Paper style={{ padding: '2rem', marginTop: '2rem' }}>
                <Typography variant="h5" component="h1" gutterBottom>
                    {intl.formatMessage({ id: 'login.title' })}
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label={intl.formatMessage({ id: 'login.email' })}
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <TextField
                        fullWidth
                        margin="normal"
                        label={intl.formatMessage({ id: 'login.password' })}
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    {error && (
                        <Typography color="error" variant="body2">
                            {error}
                        </Typography>
                    )}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        style={{ marginTop: '1rem' }}
                    >
                        {intl.formatMessage({ id: 'login.submit' })}
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default Login;
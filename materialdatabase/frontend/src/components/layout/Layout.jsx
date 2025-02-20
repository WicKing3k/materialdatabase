import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../common/Header';
import Footer from '../common/Footer';
import { Container } from '@material-ui/core';

const Layout = ({ children }) => {
    const { user } = useAuth();

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <Container style={{ flex: 1, padding
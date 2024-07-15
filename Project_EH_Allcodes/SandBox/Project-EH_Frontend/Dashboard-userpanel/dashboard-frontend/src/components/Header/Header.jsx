import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [title, setTitle] = useState('Dashboard');
    const [user, setUser] = useState({
        fullName: '',
        profilePicture: ''
    });

    useEffect(() => {
        const pathTitleMap = {
            '/dashboard': 'Dashboard',
            '/wallet': 'Wallet',
            '/advertise': 'Advertise',
            '/earn': 'Earn',
            '/statement': 'Statement',
            '/profile': 'Profile',
            '/logout': 'Logout',
            '/': 'Dashboard', // Default route
        };

        setTitle(pathTitleMap[location.pathname] || 'Dashboard');
    }, [location.pathname]);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const token = localStorage.getItem('access_token');
                const response = await axios.get('http://localhost:8000/api/profile/', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const { first_name, last_name, photo } = response.data;
                setUser({
                    fullName: `${first_name} ${last_name}`,
                    profilePicture: photo || 'https://randomuser.me/api/portraits/men/75.jpg'
                });
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        };

        fetchUserDetails();
    }, []);

    const handleProfileClick = () => {
        navigate('/dashboard/profile');
    };

    return (
        <div className="outerHeader">
            <div className="header" id='header'>
                <div className="left-section">
                    <div className="header-title">{title}</div>
                </div>
                <div className="right-section">
                    <div className="spacer"></div>
                    <div className="profile-section" onClick={handleProfileClick}>
                        <div className="profile-name">{user.fullName}</div>
                        <img
                            src={user.profilePicture}
                            alt="Profile Avatar"
                            className="profile-avatar"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;

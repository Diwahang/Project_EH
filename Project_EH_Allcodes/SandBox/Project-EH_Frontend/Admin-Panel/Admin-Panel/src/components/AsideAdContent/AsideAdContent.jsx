import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AsideAdContent.css';

const AsideAdContent = () => {
    const [ads, setAds] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAds();
    }, []);

    const fetchAds = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.get('http://localhost:8000/api/admin_ads/list/', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setAds(response.data);
        } catch (error) {
            console.error('Error fetching ads:', error);
        }
    };

    const handleAdClick = (id) => {
        navigate(`/admin_ads/${id}`);
    };

    return (
        <div className="AsideAdContent-container">
            {ads.map((ad) => (
                <div key={ad.id} className="ad-square" onClick={() => handleAdClick(ad.id)}>
                    <img src={ad.thumbnail} alt={ad.title} />
                </div>
            ))}
        </div>
    );
};

export default AsideAdContent;

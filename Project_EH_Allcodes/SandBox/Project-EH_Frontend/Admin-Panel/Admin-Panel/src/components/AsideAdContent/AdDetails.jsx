import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './AdDetails.css';

const AdDetails = () => {
    const { id } = useParams();
    const [ad, setAd] = useState(null);

    useEffect(() => {
        fetchAdDetails();
    }, [id]);

    const fetchAdDetails = async () => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.get(`http://localhost:8000/api/admin_ads/${id}/`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setAd(response.data);
        } catch (error) {
            console.error('Error fetching ad details:', error);
        }
    };

    if (!ad) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="ad-page-wrapper">
            <article className="ad-article">
                <header className="ad-header">
                    <div className="ad-meta">
                        <span className="ad-category">Ad ID: {ad.id}</span>
                        <span className="ad-date">Created: {new Date(ad.created_at).toLocaleDateString()}</span>
                    </div>
                    <h1 className="ad-title">{ad.title}</h1>
                    <div className="ad-subtitle">Priority: {ad.priority}</div>
                </header>
                <div className="ad-content">
                    <figure className="ad-media">
                        <img src={ad.thumbnail} alt={ad.title} className="ad-thumbnail" />
                        <figcaption>Advertisement Thumbnail</figcaption>
                    </figure>
                    <section className="ad-details">
                        <h2 className="section-title">Details</h2>
                        <div className="ad-details-content">
                            <p>{ad.details}</p>
                        </div>
                    </section>
                    {ad.discounts && (
                        <section className="ad-discounts">
                            <h2 className="section-title">Discounts</h2>
                            <div className="discount-box">
                                <p>{ad.discounts}</p>
                            </div>
                        </section>
                    )}
                    {ad.offers && (
                        <section className="ad-offers">
                            <h2 className="section-title">Offers</h2>
                            <div className="offer-box">
                                <p>{ad.offers}</p>
                            </div>
                        </section>
                    )}
                    {ad.referral_code && (
                        <section className="ad-referral">
                            <h2 className="section-title">Referral Code</h2>
                            <div className="referral-box">
                                <span className="referral-code">{ad.referral_code}</span>
                            </div>
                        </section>
                    )}
                    {ad.guidelines && (
                        <section className="ad-guidelines">
                            <h2 className="section-title">Guidelines</h2>
                            <div className="guidelines-content">
                                <p>{ad.guidelines}</p>
                            </div>
                        </section>
                    )}
                    {ad.links && (
                        <section className="ad-links">
                            <h2 className="section-title">Learn More</h2>
                            <a href={ad.links} target="_blank" rel="noopener noreferrer" className="more-info-link">
                                Visit Link
                                <span className="arrow">→</span>
                            </a>
                        </section>
                    )}
                    <section className="ad-info">
                        <h2 className="section-title">Additional Information</h2>
                        <div className="info-grid">
                            <div className="info-item">
                                <strong>Status:</strong> {ad.is_running ? 'Running' : 'Not Running'}
                            </div>
                            <div className="info-item">
                                <strong>Duration:</strong> {ad.duration}
                            </div>
                            <div className="info-item">
                                <strong>Last Updated:</strong> {new Date(ad.updated_at).toLocaleString()}
                            </div>
                        </div>
                    </section>
                </div>
                <footer className="ad-footer">
                    <p>This is a sponsored advertisement. Terms and conditions may apply.</p>
                </footer>
            </article>
        </div>
    );
};

export default AdDetails;
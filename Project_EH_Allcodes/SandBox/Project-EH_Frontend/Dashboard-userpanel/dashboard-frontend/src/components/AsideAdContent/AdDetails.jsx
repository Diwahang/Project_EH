import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
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
        <div className="ad-details-container">
            <header className="ad-header">
                <h1>{ad.title}</h1>
                <div className="ad-meta">
                    <span>Created: {new Date(ad.created_at).toLocaleDateString()}</span>
                </div>
            </header>
            <main className="ad-content">
                <img src={ad.thumbnail} alt={ad.title} className="ad-thumbnail" />
                <section className="ad-section">
                    <h2>Details</h2>
                    <CKEditor
                        editor={ClassicEditor}
                        data={ad.details}
                        disabled={true}
                        config={{
                            toolbar: []
                        }}
                    />
                </section>
                {ad.discounts && (
                    <section className="ad-section">
                        <h2>Discounts</h2>
                        <p>{ad.discounts}</p>
                    </section>
                )}
                {ad.offers && (
                    <section className="ad-section">
                        <h2>Offers</h2>
                        <p>{ad.offers}</p>
                    </section>
                )}
                {ad.referral_code && (
                    <section className="ad-section">
                        <h2>Referral Code</h2>
                        <p className="referral-code">{ad.referral_code}</p>
                    </section>
                )}
                {ad.guidelines && (
                    <section className="ad-section">
                        <h2>Guidelines</h2>
                        <CKEditor
                            editor={ClassicEditor}
                            data={ad.guidelines}
                            disabled={true}
                            config={{
                                toolbar: []
                            }}
                        />
                    </section>
                )}
                {ad.links && (
                    <section className="ad-section">
                        <h2>Learn More</h2>
                        <a href={ad.links} target="_blank" rel="noopener noreferrer" className="more-info-link">
                            Visit Link
                        </a>
                    </section>
                )}
                <section className="ad-section">
                    <h2>Additional Information</h2>
                    <div className="info-grid">
                        <div>Status: {ad.is_running ? 'Running' : 'Not Running'}</div>
                        <div>Duration: {ad.duration}</div>
                        <div>Last Updated: {new Date(ad.updated_at).toLocaleString()}</div>
                    </div>
                </section>
            </main>
            <footer className="ad-footer">
                <p>This is a sponsored advertisement. Terms and conditions may apply.</p>
            </footer>
        </div>
    );
};

export default AdDetails;
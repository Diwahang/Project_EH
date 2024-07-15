import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
    const [profile, setProfile] = useState({
        user_name: '',
        user_id: '',
        email: '',
        first_name: '',
        last_name: '',
        photo: '',
        date_of_birth: '',
        age: '',
        nationality: '',
        gender: '',
        wallet_balance: '',
        phone_number: '',
        bio: '',
        referral_code: '',
        referral_count: '',
        date_joined: ''
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showEditForm, setShowEditForm] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [acknowledgement, setAcknowledgement] = useState('');
    const [showPhotoOptions, setShowPhotoOptions] = useState(false);
    const [showLargePhoto, setShowLargePhoto] = useState(false);
    const [showChangePhoto, setShowChangePhoto] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    useEffect(() => {
        return () => {
            if (profile.photo && typeof profile.photo === 'string' && profile.photo.startsWith('blob:')) {
                URL.revokeObjectURL(profile.photo);
            }
        };
    }, [profile.photo]);

    const fetchProfile = () => {
        const token = localStorage.getItem('access_token');
        axios.get('http://127.0.0.1:8000/api/profile/', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                setProfile(response.data);
                setLoading(false);
            })
            .catch(error => {
                setError('Failed to fetch profile data');
                setLoading(false);
            });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prevProfile => ({
            ...prevProfile,
            [name]: value ?? '',
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfile(prevProfile => ({
                ...prevProfile,
                photo: file,
            }));
        }
    };

    const handleSubmitDetails = (e) => {
        e.preventDefault();
        const formData = new FormData();
        const editableFields = ['date_of_birth', 'nationality', 'gender', 'phone_number', 'bio', 'first_name', 'last_name'];

        editableFields.forEach(field => {
            if (profile[field] !== '' && profile[field] !== null) {
                if (field === 'date_of_birth' && profile[field]) {
                    formData.append(field, new Date(profile[field]).toISOString().split('T')[0]);
                } else {
                    formData.append(field, profile[field]);
                }
            }
        });

        const token = localStorage.getItem('access_token');
        const url = 'http://127.0.0.1:8000/api/update-profile/';
        const headers = {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
        };

        axios.patch(url, formData, { headers })
            .then(response => {
                setProfile(prevProfile => ({
                    ...prevProfile,
                    ...response.data
                }));
                setAcknowledgement('Profile updated successfully');
                setShowEditForm(false);
                setTimeout(() => setAcknowledgement(''), 3000);
            })
            .catch(error => {
                console.error('Error updating profile:', error.response?.data || error.message);
                setError(error.response?.data?.detail || 'Failed to update profile');
            });
    };

    const handleSubmitPhoto = (e) => {
        e.preventDefault();
        const formData = new FormData();
        if (profile.photo instanceof File) {
            formData.append('photo', profile.photo);
        }

        const token = localStorage.getItem('access_token');
        const url = 'http://127.0.0.1:8000/api/update-profile/';
        const headers = {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
        };

        axios.patch(url, formData, { headers })
            .then(response => {
                setProfile(prevProfile => ({
                    ...prevProfile,
                    ...response.data
                }));
                setAcknowledgement('Profile picture updated successfully');
                setShowChangePhoto(false);
                setTimeout(() => setAcknowledgement(''), 3000);
            })
            .catch(error => {
                console.error('Error updating profile picture:', error.response?.data || error.message);
                setError(error.response?.data?.detail || 'Failed to update profile picture');
            });
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            return;
        }
        const token = localStorage.getItem('access_token');
        axios.post('http://127.0.0.1:8000/api/change-password/', {
            old_password: oldPassword,
            new_password: newPassword,
            confirm_new_password: confirmPassword
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                setAcknowledgement('Password changed successfully');
                setShowPasswordForm(false);
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setTimeout(() => setAcknowledgement(''), 3000);
            })
            .catch(error => {
                setError(error.response?.data?.detail || 'Failed to change password');
            });
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="profile-container">
            {acknowledgement && <div className="acknowledgement">{acknowledgement}</div>}
            <div className="profile-header">
                <div className="profile-avatar" id='profile-avatar-profile' onClick={() => setShowPhotoOptions(true)}>
                    {profile.photo ? (
                        <img 
                            src={profile.photo instanceof File ? URL.createObjectURL(profile.photo) : profile.photo} 
                            alt="User Avatar" 
                        />
                    ) : (
                        <img src="avatar.png" alt="User Avatar" />
                    )}
                </div>
                {showPhotoOptions && (
                    <div className="photo-options">
                        <button onClick={() => { setShowLargePhoto(true); setShowPhotoOptions(false); }}>View Profile Picture</button>
                        <button onClick={() => { setShowChangePhoto(true); setShowPhotoOptions(false); }}>Change Profile Picture</button>
                        <button onClick={() => setShowPhotoOptions(false)}>Cancel</button>
                    </div>
                )}
                {showLargePhoto && (
                    <div className="large-photo-popup">
                        <img 
                            src={profile.photo instanceof File ? URL.createObjectURL(profile.photo) : profile.photo} 
                            alt="Large User Avatar" 
                            className="large-photo"
                        />
                        <button onClick={() => setShowLargePhoto(false)}>Close</button>
                    </div>
                )}
                {showChangePhoto && (
                    <div className="change-photo-popup">
                        <input type="file" accept="image/*" onChange={handleFileChange} />
                        <button onClick={handleSubmitPhoto}>OK</button>
                        <button onClick={() => setShowChangePhoto(false)}>Cancel</button>
                    </div>
                )}
                <div className="profile-actions">
                    <button onClick={() => { setShowEditForm(true); setShowPasswordForm(false); }} className="edit-details">Edit Details</button>
                    <button onClick={() => { setShowPasswordForm(true); setShowEditForm(false); }} className="change-password">Change Password</button>
                </div>
                <div className="profile-username">
                    <h2>{`${profile.first_name} ${profile.last_name}`}</h2>
                    <span className="user-id">{profile.bio}</span>
                    {/* <span className="user-id">USER ID: {profile.user_id}</span> */}
                </div>
            </div>
            {showEditForm && (
                <form onSubmit={handleSubmitDetails} className="profile-form">
                    <div className="form-group">
                        <label>First Name:</label>
                        <input type="text" name="first_name" value={profile.first_name || ''} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Last Name:</label>
                        <input type="text" name="last_name" value={profile.last_name || ''} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Date of Birth:</label>
                        <input type="date" name="date_of_birth" value={profile.date_of_birth || ''} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Gender:</label>
                        <select name="gender" value={profile.gender || ''} onChange={handleChange}>
                            <option value="">Select Gender</option>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                            <option value="O">Other</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Phone Number:</label>
                        <input type="text" name="phone_number" value={profile.phone_number || ''} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Bio:</label>
                        <textarea name="bio" value={profile.bio || ''} onChange={handleChange}></textarea>
                    </div>
                    <div className="form-group">
                        <label>Nationality:</label>
                        <input type="text" name="nationality" value={profile.nationality || ''} onChange={handleChange} />
                    </div>
                    <button type="submit">Update Profile</button>
                    <button type="button" onClick={() => setShowEditForm(false)}>Cancel</button>
                </form>
            )}
            {showPasswordForm && (
                <form onSubmit={handlePasswordChange} className="password-form">
                    <div className="form-group">
                        <label>Old Password:</label>
                        <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>New Password:</label>
                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Confirm New Password:</label>
                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </div>
                    <button type="submit">Change Password</button>
                    <button type="button" onClick={() => setShowPasswordForm(false)}>Cancel</button>
                </form>
            )}
            {!showEditForm && !showPasswordForm && (
                <div className="profile-info">
                    <div className="profile-info-item">
                        <i className="fa fa-user"></i>
                        <span className="info-label">Username:</span>
                        <span className="info-value">{profile.user_name}</span>
                    </div>
                    <div className="profile-info-item">
                        <i className="fa fa-user"></i>
                        <span className="info-label">User ID:</span>
                        <span className="info-value">{profile.user_id}</span>
                    </div>
                    <div className="profile-info-item">
                        <i className="fa fa-phone"></i>
                        <span className="info-label">Contact:</span>
                        <span className="info-value">{profile.phone_number}</span>
                    </div>
                    <div className="profile-info-item">
                        <i className="fa fa-birthday-cake"></i>
                        <span className="info-label">DOB:</span>
                        <span className="info-value">{profile.date_of_birth || 'N/A'}</span>
                    </div>
                    <div className="profile-info-item">
                        <i className="fa fa-birthday-cake"></i>
                        <span className="info-label">Age:</span>
                        <span className="info-value">{profile.age || '21'}</span>
                    </div>
                    <div className="profile-info-item">
                        <i className="fa fa-venus-mars"></i>
                        <span className="info-label">Gender:</span>
                        <span className="info-value">{profile.gender}</span>
                    </div>
                    <div className="profile-info-item">
                        <i className="fa fa-envelope"></i>
                        <span className="info-label">Email:</span>
                        <span className="info-value">{profile.email}</span>
                        <button className="verify-email">Verified</button>
                    </div>
                    <div className="profile-info-item">
                        <i className="fa fa-users"></i>
                        <span className="info-label">Total Referrals:</span>
                        <span className="info-value">{profile.referral_count || 'N/A'}</span>
                    </div>
                    <div className="profile-info-item">
                        <i className="fa fa-code"></i>
                        <span className="info-label">Referral Code:</span>
                        <span className="info-value">{profile.referral_code || 'N/A'}</span>
                    </div>
                    <div className="profile-info-item">
                        <i className="fa fa-map-marker"></i>
                        <span className="info-label">Nationality:</span>
                        <span className="info-value">{profile.nationality || 'N/A'}</span>
                    </div>
                    <div className="profile-info-item">
                        <i className="fa fa-calendar"></i>
                        <span className="info-label">Joined:</span>
                        <span className="info-value">{profile.date_joined || 'N/A'}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;

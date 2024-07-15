import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Dashboard.css';

const Dashboard = () => {
    return (
        <div className="dashboard">
            <div className="video-container">
                <video id="main-video" className="d-block w-100" controls autoPlay muted>
                    <source src="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
            <div className="features">
            Feature every part of navbar in the scroll screen.!!!
            yo k bhaneko maile bujena so khali choddiye.

            </div>
        </div>
    );
};

export default Dashboard;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Advertise.css';
import axios from 'axios';
import { Card, CardContent, CardMedia, Typography, Button, Chip, Grid, Box } from '@mui/material';

const Advertise = () => {
  const [advertisements, setAdvertisements] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdvertisements();
  }, [activeTab]);

  const fetchAdvertisements = async () => {
    try {
      const token = localStorage.getItem('access_token');
      let url = 'http://localhost:8000/api/advertisements';
      
      if (activeTab !== 'all') {
        url += `?status=${activeTab}`;
      }
      
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setAdvertisements(response.data);
    } catch (error) {
      console.error('Error fetching advertisements:', error);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleCreateClick = () => {
    navigate('/dashboard/Create');
  };

  const handleDetailsClick = (id) => {
    navigate(`/dashboard/details/${id}`);
  };

  return (
    <Box className="advertise-container">
      <Box className="tabs">
        <Button 
          variant={activeTab === 'all' ? 'contained' : 'outlined'} 
          onClick={() => handleTabChange('all')}
        >
          All
        </Button>
        <Button 
          variant={activeTab === 'active' ? 'contained' : 'outlined'} 
          onClick={() => handleTabChange('Active')}
        >
          Active
        </Button>
        <Button 
          variant={activeTab === 'completed' ? 'contained' : 'outlined'} 
          onClick={() => handleTabChange('completed')}
        >
          Completed
        </Button>
        <Button 
          variant={activeTab === 'draft' ? 'contained' : 'outlined'} 
          onClick={() => handleTabChange('draft')}
        >
          Draft
        </Button>
        <Button variant="contained" color="primary" onClick={handleCreateClick}>+ Create</Button>
      </Box>
      <Box className="advertisement-list">
        {advertisements.map(ad => (
          <Card key={ad.id} className="job-card">
            <Grid container>
              <Grid item xs={12} md={6} className="thumbnail-container">
                <CardMedia
                  component="img"
                  className="job-thumbnail"
                  image={ad.thumbnail || 'placeholder-image-url'}
                  alt={ad.title}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CardContent className="job-content">
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" component="div">{ad.title}</Typography>
                    <Chip label={ad.status} color={ad.status === 'Active' ? 'success' : 'default'} size="small" />
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2">Category: {ad.category_name}</Typography>
                      <Typography variant="body2">Budget: ${ad.budget}</Typography>
                      <Typography variant="body2">Remaining: ${ad.remaining_budget}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">Per Job: ${ad.per_job}</Typography>
                      <Typography variant="body2">Submissions: {ad.submissions}</Typography>
                      <Typography variant="body2">Terminate: {new Date(ad.terminate).toLocaleDateString()}</Typography>
                    </Grid>
                  </Grid>
                  <Box mt={2}>
                    <Button variant="outlined" color="primary" onClick={() => {}}>Add Fund</Button>
                    <Button variant="contained" color="primary" onClick={() => handleDetailsClick(ad.id)}>Details</Button>
                  </Box>
                </CardContent>
              </Grid>
            </Grid>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default Advertise;
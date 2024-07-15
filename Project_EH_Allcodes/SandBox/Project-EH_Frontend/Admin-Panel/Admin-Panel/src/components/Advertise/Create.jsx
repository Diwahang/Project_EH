import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Create.css";

const Create = () => {
  const [formData, setFormData] = useState({
    title: "",
    category_name: "",
    budget: 0,
    per_job: 0,
    limit: "days",
    time: "",
    description: "",
    confirmation_requirements: "",
    requires_media: false,
    media_type: "",
    thumbnail: null,
    video: null
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else if (type === "file") {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const calculateBudget = (terminateDate) => {
    const currentDate = new Date();
    const terminate = new Date(terminateDate);
    const timeDiff = terminate - currentDate;
    const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return days * 100;
  };

  useEffect(() => {
    if (formData.limit === "days" && formData.time) {
      const calculatedBudget = calculateBudget(formData.time);
      setFormData((prevFormData) => ({
        ...prevFormData,
        budget: calculatedBudget,
      }));
    }
  }, [formData.limit, formData.time]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token'); // Get the token from local storage

    const data = new FormData();
    for (const key in formData) {
      if (formData[key] !== null) {
        if (key !== "budget" || formData.limit !== "days") {
          data.append(key, formData[key]);
        }
      }
    }

    if (formData.limit === "days") {
      data.set("terminate", formData.time);
    } else if (formData.limit === "jobs") {
      data.set("terminate", new Date(new Date().setDate(new Date().getDate() + 60)).toISOString().split('T')[0]);
    }

    console.log("Form Data:", Object.fromEntries(data.entries()));

    try {
      const response = await axios.post(
        "http://localhost:8000/api/advertisements/create/",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`  // Include the token in the authorization header
          },
        }
      );
      console.log(response.data);
      alert("Advertisement created successfully!");
    } catch (error) {
      console.error("There was an error creating the advertisement!", error);
      alert("Failed to create advertisement. Please try again.");
    }
  };

  return (
    <div className="form-container">
      <h1>Create Advertisement</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="category_name">Category Name:</label>
          <input
            type="text"
            id="category_name"
            name="category_name"
            value={formData.category_name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="budget">Budget:</label>
          <input
            type="number"
            id="budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            disabled={formData.limit === "days"}
          />
        </div>

        <div className="form-group">
          <label htmlFor="per_job">Per Job:</label>
          <input
            type="number"
            id="per_job"
            name="per_job"
            value={formData.per_job}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="limit">Limit:</label>
          <select
            id="limit"
            name="limit"
            value={formData.limit}
            onChange={handleChange}
          >
            <option value="days">Days</option>
            <option value="jobs">Jobs</option>
          </select>
        </div>

        {formData.limit === "days" && (
          <div className="form-group">
            <label htmlFor="time">Time:</label>
            <input
              type="date"
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="confirmation_requirements">Confirmation Requirements:</label>
          <textarea
            id="confirmation_requirements"
            name="confirmation_requirements"
            value={formData.confirmation_requirements}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="form-group">
          <label>Does your ad need to upload screenshots or videos?</label>
          <input
            type="radio"
            id="yes"
            name="requires_media"
            value={true}
            checked={formData.requires_media}
            onChange={handleChange}
          />
          <label htmlFor="yes">Yes</label>
          <input
            type="radio"
            id="no"
            name="requires_media"
            value={false}
            checked={!formData.requires_media}
            onChange={handleChange}
          />
          <label htmlFor="no">No</label>
        </div>

        {formData.requires_media && (
          <div className="form-group">
            <label>If yes, Photos or video?</label>
            <input
              type="radio"
              id="photos"
              name="media_type"
              value="photo"
              checked={formData.media_type === "photo"}
              onChange={handleChange}
            />
            <label htmlFor="photos">Photos</label>
            <input
              type="radio"
              id="videos"
              name="media_type"
              value="video"
              checked={formData.media_type === "video"}
              onChange={handleChange}
            />
            <label htmlFor="videos">Videos</label>
            <input
              type="radio"
              id="both"
              name="media_type"
              value="both"
              checked={formData.media_type === "both"}
              onChange={handleChange}
            />
            <label htmlFor="both">Both</label>
          </div>
        )}

        {formData.requires_media && formData.media_type !== 'photo' && (
          <div className="form-group">
            <label htmlFor="video">Upload video:</label>
            <input
              type="file"
              id="video"
              name="video"
              accept="video/*"
              onChange={handleChange}
            />
          </div>
        )}

        {formData.requires_media && formData.media_type !== 'video' && (
          <div className="form-group">
            <label htmlFor="thumbnail">Upload thumbnail:</label>
            <input
              type="file"
              id="thumbnail"
              name="thumbnail"
              accept="image/*"
              onChange={handleChange}
            />
          </div>
        )}

        <button type="submit">Create Advertisement</button>
      </form>
    </div>
  );
};

export default Create;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
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
    video: null,
    requires_tutorial_video: false,
    tutorial_video_url: ""
  });
  const [showPreviewPopup, setShowPreviewPopup] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else if (name === "requires_media") {
      setFormData({
        ...formData,
        requires_media: checked,
        media_type: checked ? "" : "",
      });
    } else if (name === "media_type") {
      setFormData({
        ...formData,
        media_type: value,
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleCKEditorChange = (event, editor, name) => {
    const data = editor.getData();
    setFormData({
      ...formData,
      [name]: data,
    });
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
    await createAdvertisement();
  };

  const handleSaveAsDraft = async () => {
    await createAdvertisement(true);
  };

  const createAdvertisement = async (isDraft = false) => {
    const token = localStorage.getItem('access_token');

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

    if (isDraft) {
      data.append("status", "draft");
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/advertisements/create/",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          },
        }
      );
      console.log(response.data);
      alert(isDraft ? "Advertisement saved as draft successfully!" : "Advertisement created successfully!");
      setShowPreviewPopup(false);
    } catch (error) {
      console.error(isDraft ? "There was an error saving the advertisement as draft!" : "There was an error creating the advertisement!", error);
      alert(isDraft ? "Failed to save advertisement as draft. Please try again." : "Failed to create advertisement. Please try again.");
    }
  };

  const handlePreview = () => {
    setShowPreviewPopup(true);
  };

  const closePreview = () => {
    setShowPreviewPopup(false);
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
          <CKEditor
            editor={ClassicEditor}
            data={formData.description}
            onChange={(event, editor) => handleCKEditorChange(event, editor, "description")}
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmation_requirements">Confirmation Requirements:</label>
          <CKEditor
            editor={ClassicEditor}
            data={formData.confirmation_requirements}
            onChange={(event, editor) => handleCKEditorChange(event, editor, "confirmation_requirements")}
          />
        </div>

        <div className="form-group">
          <label>Does your ad need to upload screenshots or video confirmations?</label>
          <div>
            <input
              type="radio"
              id="requires_media_yes"
              name="requires_media"
              value="true"
              checked={formData.requires_media === true}
              onChange={() => handleChange({ target: { name: "requires_media", checked: true } })}
            />
            <label htmlFor="requires_media_yes">Yes</label>
          </div>
          <div>
            <input
              type="radio"
              id="requires_media_no"
              name="requires_media"
              value="false"
              checked={formData.requires_media === false}
              onChange={() => handleChange({ target: { name: "requires_media", checked: false } })}
            />
            <label htmlFor="requires_media_no">No</label>
          </div>
        </div>

        {formData.requires_media && (
          <div className="form-group">
            <label>If yes, Photos or video?</label>
            <div>
              <input
                type="radio"
                id="media_type_photos"
                name="media_type"
                value="photo"
                checked={formData.media_type === "photo"}
                onChange={handleChange}
              />
              <label htmlFor="media_type_photos">Photos</label>
            </div>
            <div>
              <input
                type="radio"
                id="media_type_videos"
                name="media_type"
                value="video"
                checked={formData.media_type === "video"}
                onChange={handleChange}
              />
              <label htmlFor="media_type_videos">Videos</label>
            </div>
            <div>
              <input
                type="radio"
                id="media_type_both"
                name="media_type"
                value="both"
                checked={formData.media_type === "both"}
                onChange={handleChange}
              />
              <label htmlFor="media_type_both">Both</label>
            </div>
          </div>
        )}

        {formData.requires_media && (formData.media_type === 'photo' || formData.media_type === 'both') && (
          <div className="form-group">
            <label htmlFor="thumbnail">Choose photo:</label>
            <input
              type="file"
              id="thumbnail"
              name="thumbnail"
              accept="image/*"
              onChange={handleChange}
            />
          </div>
        )}

        {formData.requires_media && (formData.media_type === 'video' || formData.media_type === 'both') && (
          <div className="form-group">
            <label htmlFor="video">Choose video:</label>
            <input
              type="file"
              id="video"
              name="video"
              accept="video/*"
              onChange={handleChange}
            />
          </div>
        )}

        <div className="form-group">
          <label>Does your ad have a youtube tutorial link?</label>
          <div>
            <input
              type="radio"
              id="tutorial_yes"
              name="requires_tutorial_video"
              value="true"
              checked={formData.requires_tutorial_video === true}
              onChange={() => setFormData({ ...formData, requires_tutorial_video: true })}
            />
            <label htmlFor="tutorial_yes">Yes</label>
          </div>
          <div>
            <input
              type="radio"
              id="tutorial_no"
              name="requires_tutorial_video"
              value="false"
              checked={formData.requires_tutorial_video === false}
              onChange={() => setFormData({ ...formData, requires_tutorial_video: false, tutorial_video_url: "" })}
            />
            <label htmlFor="tutorial_no">No</label>
          </div>
        </div>

        {formData.requires_tutorial_video && (
          <div className="form-group">
            <label htmlFor="tutorial_video_url">Tutorial Video URL:</label>
            <input
              type="url"
              id="tutorial_video_url"
              name="tutorial_video_url"
              value={formData.tutorial_video_url}
              onChange={handleChange}
            />
          </div>
        )}

        <div className="button-group">
          <button type="button" onClick={handlePreview}>Preview</button>
          <button type="submit">Create Advertisement</button>
        </div>
      </form>

      {showPreviewPopup && (
        <div className="preview-popup">
          <div className="preview-content">
            <h2>Advertisement Preview</h2>
            <div className="ad-card">
              <h3 className="ad-title">{formData.title}</h3>
              <div className="ad-info">
                <div className="info-item">
                  <span className="info-label">Category:</span>
                  <span>{formData.category_name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Budget:</span>
                  <span>{formData.budget}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Per Job:</span>
                  <span>{formData.per_job}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Limit:</span>
                  <span>{formData.limit}</span>
                </div>
                {formData.limit === "days" && (
                  <div className="info-item">
                    <span className="info-label">Time:</span>
                    <span>{formData.time}</span>
                  </div>
                )}
              </div>
              <div className="text-box">
                <h3>Description</h3>
                <p dangerouslySetInnerHTML={{ __html: formData.description }}></p>
              </div>
              <div className="text-box">
                <h3>Confirmation Requirements</h3>
                <p dangerouslySetInnerHTML={{ __html: formData.confirmation_requirements }}></p>
              </div>
              <div className="ad-details">
                <div className="detail-item">
                  <span className="detail-label">Requires Media:</span>
                  <span>{formData.requires_media ? 'Yes' : 'No'}</span>
                </div>
                {formData.requires_media && (
                  <div className="detail-item">
                    <span className="detail-label">Media Type:</span>
                    <span>{formData.media_type}</span>
                  </div>
                )}
                {formData.requires_tutorial_video && (
                  <div className="detail-item">
                    <span className="detail-label">Tutorial Video URL:</span>
                    <span>{formData.tutorial_video_url}</span>
                  </div>
                )}
              </div>
              {formData.requires_media && (
                <div className="media-section">
                  <h3>Media Preview</h3>
                  {formData.thumbnail && (
                    <img src={URL.createObjectURL(formData.thumbnail)} alt="Thumbnail" />
                  )}
                  {formData.video && (
                    <video controls>
                      <source src={URL.createObjectURL(formData.video)} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              )}
            </div>
            <div className="button-group">
              <button onClick={handleSubmit}>Create Advertisement</button>
              <button onClick={handleSaveAsDraft}>Save as Draft</button>
              <button onClick={closePreview}>Close Preview</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Create;

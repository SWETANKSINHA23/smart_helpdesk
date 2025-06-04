import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const KBCreatePage = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState('draft');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/kb`, {
        title,
        body,
        tags: tags.split(',').map(tag => tag.trim()),
        status,
      });
      toast.success('KB article created successfully!');
      navigate('/admin');
    } catch (error) {
      toast.error('Failed to create KB article.');
    }
  };

  return (
    <div className="card shadow-sm mx-auto" style={{ maxWidth: '700px' }}>
      <div className="card-body p-4">
        <h1 className="card-title text-primary mb-4">Create New KB Article</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="body" className="form-label">Body</label>
            <textarea
              className="form-control"
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows="8"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="tags" className="form-label">Tags (comma-separated)</label>
            <input
              type="text"
              className="form-control"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="status" className="form-label">Status</label>
            <select
              className="form-select"
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Create Article</button>
        </form>
      </div>
    </div>
  );
};

export default KBCreatePage;
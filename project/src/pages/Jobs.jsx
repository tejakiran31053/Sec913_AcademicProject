import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { jobsData, categories } from '../data/jobsData';
import './jobs.css';

const typeColors = {
  'Full-Time': 'badge-emerald',
  'Part-Time': 'badge-amber',
  'Contract': 'badge-cyan',
  'Internship': 'badge-indigo',
};

const Jobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [remoteOnly, setRemoteOnly] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get('category');
    if (cat) setSelectedCategory(cat);
  }, [location.search]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/jobs")
  .then((res) => res.json())
  .then((data) => {
    const fixedJobs = data.map((job) => ({
      ...job,
      skills: job.skills ? job.skills.split(",").map(s => s.trim()) : [],
      type: job.type || "Full-Time",
      category: job.category || "Engineering",
      experience: job.experience || "0-1 years",
      remote: job.remote || false,
      postedDate: job.postedDate || new Date().toISOString(),
      description: job.description || "No description available"
    }));

    setJobs(fixedJobs);
    setLoading(false);
  })
  .catch(() => {
    setJobs([]);
    setLoading(false);
  });
  }, []);

  // Semantic search: match title, company, skills, description, category, type, location
  const filtered = jobs.filter((job) => {
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      job.title.toLowerCase().includes(q) ||
      job.company.toLowerCase().includes(q) ||
      job.description.toLowerCase().includes(q) ||
      job.location.toLowerCase().includes(q) ||
      job.skills.some((s) => s.toLowerCase().includes(q)) ||
      job.category.toLowerCase().includes(q) ||
      job.type.toLowerCase().includes(q) ||
      (q.includes('fresh') && job.experience.startsWith('0')) ||
      (q.includes('remote') && job.remote) ||
      (q.includes('cloud') && job.skills.some(s => s.toLowerCase().includes('cloud'))) ||
      (q.includes('software') && ['Engineering', 'Mobile'].includes(job.category));

    const matchesCategory =
      selectedCategory === 'All' || job.category === selectedCategory;

    const matchesType = selectedType === 'All' || job.type === selectedType;

    const matchesRemote = !remoteOnly || job.remote;

    return matchesSearch && matchesCategory && matchesType && matchesRemote;
  });

  if (loading) {
    return (
      <div className="page-loading">
        <div className="page-spinner" />
        <p className="loading-text">Fetching jobs…</p>
      </div>
    );
  }

  return (
    <div className="jobs-page">
      {/* Header */}
      <div className="jobs-header">
        <div className="section-tag">Job Listings</div>
        <h1 className="jobs-title">Find Your Next Role</h1>
        <p className="jobs-subtitle">
          {filtered.length} position{filtered.length !== 1 ? 's' : ''} matching your search
        </p>
      </div>

      {/* Search & Filters */}
      <div className="jobs-filters">
        <div className="search-bar-wrapper">
          <span className="search-icon">🔍</span>
          <input
            id="job-search"
            className="search-input"
            type="text"
            placeholder='Try "Software developer for freshers" or "Remote cloud engineering"…'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              className="search-clear"
              onClick={() => setSearch('')}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <div className="filter-row">
          <div className="filter-group">
            <label className="filter-label">Category</label>
            <div className="filter-chips">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`filter-chip${selectedCategory === cat ? ' active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label className="filter-label">Type</label>
            <div className="filter-chips">
              {['All', 'Full-Time', 'Part-Time'].map((type) => (
                <button
                  key={type}
                  className={`filter-chip${selectedType === type ? ' active' : ''}`}
                  onClick={() => setSelectedType(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <label className="remote-toggle">
            <input
              type="checkbox"
              checked={remoteOnly}
              onChange={(e) => setRemoteOnly(e.target.checked)}
            />
            <span className="toggle-switch" />
            <span className="toggle-label">Remote Only</span>
          </label>
        </div>
      </div>

      {/* Job Cards */}
      {filtered.length === 0 ? (
        <div className="jobs-empty">
          <div className="jobs-empty-icon">🔍</div>
          <h3>No jobs found</h3>
          <p>Try adjusting your search or filters to find more opportunities.</p>
          <button
            className="btn-secondary"
            onClick={() => { setSearch(''); setSelectedCategory('All'); setSelectedType('All'); setRemoteOnly(false); }}
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="jobs-grid">
          {filtered.map((job, idx) => (
            <div
              key={job.id}
              className="job-card"
              style={{ animationDelay: `${idx * 0.07}s` }}
            >
              <div className="job-card-top">
                <div className="job-company-logo">
                  {job.company.slice(0, 2).toUpperCase()}
                </div>
                <div className="job-card-meta">
                  <span className={`badge ${typeColors[job.type] || 'badge-indigo'}`}>
                    {job.type}
                  </span>
                  {job.remote && (
                    <span className="badge badge-cyan">🌐 Remote</span>
                  )}
                </div>
              </div>

              <div className="job-card-body">
                <h3 className="job-title">{job.title}</h3>
                <p className="job-company">{job.company}</p>

                <div className="job-info-row">
                  <span className="job-info-item">📍 {job.location}</span>
                  <span className="job-info-item">💰 {job.salary}</span>
                  <span className="job-info-item">🎓 {job.experience}</span>
                </div>

                <p className="job-excerpt">
                  {job.description.slice(0, 110)}…
                </p>

                <div className="job-skills">
                  {job.skills.slice(0, 4).map((skill) => (
                    <span key={skill} className="skill-tag">{skill}</span>
                  ))}
                  {job.skills.length > 4 && (
                    <span className="skill-tag">+{job.skills.length - 4}</span>
                  )}
                </div>
              </div>

              <div className="job-card-footer">
                <span className="job-posted">
                  Posted {new Date(job.postedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </span>
                <button
  type="button"
  className="view-details-btn"
  onClick={() => navigate(`/job/${job.id}`)}
>
  View Details →
</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Jobs;
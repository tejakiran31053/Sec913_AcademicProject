import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './jobdetails.css';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/jobs")
      .then(res => res.json())
      .then(data => {
        const foundJob = data.find(j => String(j.id) === String(id));

        if (foundJob) {
          foundJob.skills = foundJob.skills
            ? foundJob.skills.split(",").map(s => s.trim())
            : [];

          foundJob.type = foundJob.type || "Full-Time";
          foundJob.category = foundJob.category || "Engineering";
          foundJob.experience = foundJob.experience || "0-1 years";
          foundJob.description = foundJob.description || "No description available";
        }

        setJob(foundJob);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="page-loading">Loading job details...</div>;
  }

  if (!job) {
    return (
      <div className="jd-not-found">
        <h2>Job Not Found</h2>
        <Link to="/jobs" className="btn-primary">Browse All Jobs</Link>
      </div>
    );
  }

  return (
    <div className="jd-page">
      <button className="jd-back-btn" onClick={() => navigate('/jobs')}>
        ← Back to Jobs
      </button>

      <div className="jd-layout">
        <div className="jd-main">
          <div className="jd-hero-card">
            <div className="jd-hero-top">
              <div className="jd-company-logo">
                {job.company?.slice(0, 2).toUpperCase()}
              </div>

              <div className="jd-hero-meta">
                <h1 className="jd-title">{job.title}</h1>
                <p className="jd-company">{job.company}</p>
              </div>
            </div>

            <div className="jd-info-grid">
              <div className="jd-info-item">📍 {job.location}</div>
              <div className="jd-info-item">💰 {job.salary}</div>
              <div className="jd-info-item">🎓 {job.experience}</div>
            </div>
          </div>

          <div className="jd-section-card">
            <h2 className="jd-section-title">📋 About the Role</h2>
            <p className="jd-description">{job.description}</p>
          </div>

          <div className="jd-section-card">
            <h2 className="jd-section-title">🛠 Skills Required</h2>
            <div className="jd-skills">
              {job.skills.map(skill => (
                <span key={skill} className="skill-tag">{skill}</span>
              ))}
            </div>
          </div>
        </div>

        <aside className="jd-sidebar">
          <div className="jd-apply-card">
            <h3 className="jd-apply-title">Ready to Apply?</h3>
            <p className="jd-apply-subtitle">
              Apply for this job at {job.company}.
            </p>

            <Link to={`/apply/${job.id}`} className="jd-apply-btn">
              🚀 Apply Now
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default JobDetails;
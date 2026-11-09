import { useState, useEffect } from "react";
import api from "../api.js";
import JobForm from "../components/JobForm.jsx";

const STATUSES = ["Applied", "Interview", "Offer", "Rejected"];

function Dashboard({ user, onLogout }) {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({ Total: 0, Applied: 0, Interview: 0, Offer: 0, Rejected: 0 });
  const [statusFilter, setStatusFilter] = useState(""); // "" = all
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [error, setError] = useState("");

  // Load jobs again whenever the filter or search changes
  useEffect(() => {
    loadJobs();
  }, [statusFilter, search]);

  // Load counts once
  useEffect(() => {
    loadStats();
  }, []);

  async function loadJobs() {
    try {
      const res = await api.get("/jobs", { params: { status: statusFilter, search: search } });
      setJobs(res.data);
      setError("");
    } catch (err) {
      handleError(err);
    }
  }

  async function loadStats() {
    try {
      const res = await api.get("/jobs/stats");
      setStats(res.data);
    } catch (err) {
      handleError(err);
    }
  }

  function handleError(err) {
    // token expired -> logout
    if (err.response?.status === 401) {
      onLogout();
    } else {
      setError(err.response?.data?.message || "Something went wrong");
    }
  }

  async function saveJob(form) {
    try {
      if (editingJob) {
        await api.put("/jobs/" + editingJob._id, form);
      } else {
        await api.post("/jobs", form);
      }
      setShowForm(false);
      setEditingJob(null);
      loadJobs();
      loadStats();
    } catch (err) {
      handleError(err);
    }
  }

  async function changeStatus(job, newStatus) {
    try {
      await api.put("/jobs/" + job._id, { ...job, status: newStatus });
      loadJobs();
      loadStats();
    } catch (err) {
      handleError(err);
    }
  }

  async function deleteJob(job) {
    if (!window.confirm("Delete " + job.role + " at " + job.company + "?")) return;
    try {
      await api.delete("/jobs/" + job._id);
      loadJobs();
      loadStats();
    } catch (err) {
      handleError(err);
    }
  }

  function openAdd() {
    setEditingJob(null);
    setShowForm(true);
  }

  function openEdit(job) {
    setEditingJob(job);
    setShowForm(true);
  }

  return (
    <div className="page">
      <header className="topbar">
        <h1 className="brand">Job Tracker</h1>
        <div className="topbar-right">
          <span className="muted">{user.name}</span>
          <button className="btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Counts - click one to filter */}
      <section className="stats">
        <button
          className={"stat" + (statusFilter === "" ? " active" : "")}
          onClick={() => setStatusFilter("")}
        >
          <span className="stat-num">{stats.Total}</span>
          <span className="stat-label">All</span>
        </button>
        {STATUSES.map((s) => (
          <button
            key={s}
            className={"stat s-" + s + (statusFilter === s ? " active" : "")}
            onClick={() => setStatusFilter(s)}
          >
            <span className="stat-num">{stats[s]}</span>
            <span className="stat-label">{s}</span>
          </button>
        ))}
      </section>

      <section className="toolbar">
        <input
          className="search"
          placeholder="Search company or role"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn primary" onClick={openAdd}>
          Add application
        </button>
      </section>

      {error && <p className="error">{error}</p>}

      <section className="list">
        {jobs.length === 0 && (
          <div className="empty">
            <p>
              {search || statusFilter
                ? "No applications match this filter."
                : "No applications yet. Add the first one you sent."}
            </p>
          </div>
        )}

        {jobs.map((job) => (
          <article key={job._id} className={"job s-" + job.status}>
            <div className="job-main">
              <h3>{job.role}</h3>
              <p className="company">{job.company}</p>
              {(job.location || job.salary) && (
                <p className="small">
                  {job.location}
                  {job.location && job.salary ? " | " : ""}
                  {job.salary}
                </p>
              )}
              <p className="muted small">
                Applied on {new Date(job.appliedDate).toLocaleDateString("en-IN")}
              </p>
              {job.notes && <p className="notes">{job.notes}</p>}
              {job.link && (
                <a className="small" href={job.link} target="_blank" rel="noreferrer">
                  Open job post
                </a>
              )}
            </div>

            <div className="job-side">
              <select
                className={"status-select s-" + job.status}
                value={job.status}
                onChange={(e) => changeStatus(job, e.target.value)}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <div className="job-actions">
                <button className="btn small-btn" onClick={() => openEdit(job)}>
                  Edit
                </button>
                <button className="btn small-btn danger" onClick={() => deleteJob(job)}>
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

      {showForm && (
        <JobForm
          job={editingJob}
          onSave={saveJob}
          onCancel={() => {
            setShowForm(false);
            setEditingJob(null);
          }}
        />
      )}
    </div>
  );
}

export default Dashboard;

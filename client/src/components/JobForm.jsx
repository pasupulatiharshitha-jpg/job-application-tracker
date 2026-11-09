import { useState } from "react";

const STATUSES = ["Applied", "Interview", "Offer", "Rejected"];

// Used for both "Add job" and "Edit job"
// If `job` is given -> edit mode, otherwise add mode
function JobForm({ job, onSave, onCancel }) {
  const [form, setForm] = useState({
    company: job?.company || "",
    role: job?.role || "",
    status: job?.status || "Applied",
    appliedDate: job?.appliedDate
      ? job.appliedDate.slice(0, 10)
      : new Date().toISOString().slice(0, 10),
    link: job?.link || "",
    notes: job?.notes || "",
    salary: job?.salary || "",
    location: job?.location || "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave(form);
  }

  return (
    <div className="modal-back" onClick={onCancel}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
        <h2>{job ? "Edit application" : "Add application"}</h2>

        <div className="row">
          <label>
            Company
            <input name="company" value={form.company} onChange={handleChange} required />
          </label>
          <label>
            Role
            <input name="role" value={form.role} onChange={handleChange} required />
          </label>
        </div>

        <div className="row">
          <label>
            Status
            <select name="status" value={form.status} onChange={handleChange}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label>
            Applied on
            <input type="date" name="appliedDate" value={form.appliedDate} onChange={handleChange} />
          </label>
        </div>

        <div className="row">
          <label>
            Salary
            <input name="salary" value={form.salary} onChange={handleChange} placeholder="e.g. 6 LPA" />
          </label>
          <label>
            Location
            <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. Bengaluru" />
          </label>
        </div>

        <label>
          Job link
          <input name="link" value={form.link} onChange={handleChange} placeholder="https://" />
        </label>

        <label>
          Notes
          <textarea name="notes" rows="3" value={form.notes} onChange={handleChange} />
        </label>

        <div className="actions">
          <button type="button" className="btn" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn primary">{job ? "Save changes" : "Add application"}</button>
        </div>
      </form>
    </div>
  );
}

export default JobForm;

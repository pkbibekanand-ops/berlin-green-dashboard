import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Search, Leaf, Briefcase, MapPin, CalendarDays, Globe, ExternalLink, RefreshCw } from 'lucide-react';
import './style.css';

const sectors = ['All', 'Renewable Energy', 'Sustainable Agriculture', 'Urban Farming', 'Climate Tech', 'GIS & Remote Sensing', 'Circular Economy', 'Environment'];
const types = ['All', 'Internship', 'Working Student', 'Student Job', 'Entry-Level'];
const statuses = ['All', 'Not Applied', 'Applied', 'Pending', 'Rejected', 'Accepted'];

function App() {
  const [jobs, setJobs] = useState([]);
  const [query, setQuery] = useState('');
  const [sector, setSector] = useState('All');
  const [type, setType] = useState('All');
  const [status, setStatus] = useState('All');

  useEffect(() => {
    fetch('./jobs.json')
      .then(res => res.json())
      .then(data => setJobs(data.jobs || []))
      .catch(() => setJobs([]));
  }, []);

  const filtered = useMemo(() => jobs.filter(job => {
    const text = `${job.title} ${job.company} ${job.sector} ${job.skills || ''}`.toLowerCase();
    return text.includes(query.toLowerCase()) &&
      (sector === 'All' || job.sector === sector) &&
      (type === 'All' || job.type === type) &&
      (status === 'All' || job.status === status);
  }), [jobs, query, sector, type, status]);

  return <div className="page">
    <header className="hero">
      <div>
        <p className="eyebrow"><Leaf size={18}/> Berlin Green Career Dashboard</p>
        <h1>Green Jobs, Internships & Student Work in Berlin</h1>
        <p className="subtitle">For MSc Agricultural & Environmental Management students with GIS, ArcGIS/QGIS, English B2-C1 and German A1/A2.</p>
      </div>
      <a className="refresh" href="https://github.com" target="_blank"><RefreshCw size={18}/> Weekly auto-refresh via GitHub Actions</a>
    </header>

    <section className="stats">
      <Stat title="Total Jobs" value={jobs.length}/>
      <Stat title="English Friendly" value={jobs.filter(j => (j.language || '').toLowerCase().includes('english')).length}/>
      <Stat title="Internships" value={jobs.filter(j => j.type === 'Internship').length}/>
      <Stat title="Visa/Student Friendly" value={jobs.filter(j => (j.sponsorship || '').toLowerCase() !== 'unknown').length}/>
    </section>

    <section className="filters">
      <div className="search"><Search size={18}/><input placeholder="Search GIS, climate, agriculture..." value={query} onChange={e => setQuery(e.target.value)}/></div>
      <Select value={sector} setValue={setSector} options={sectors}/>
      <Select value={type} setValue={setType} options={types}/>
      <Select value={status} setValue={setStatus} options={statuses}/>
    </section>

    <main className="grid">
      <section className="jobs">
        {filtered.map(job => <JobCard key={job.id} job={job}/>) }
        {filtered.length === 0 && <div className="empty">No jobs found. Try another filter.</div>}
      </section>
      <aside className="side">
        <Panel title="Target Sources" items={['Arbeitnow API', 'GreenJobs', 'LinkedIn manual links', 'Welcome to the Jungle', 'Berlin Startup Jobs', 'Climatebase', 'Company career pages']}/>
        <Panel title="Priority Sectors" items={['Renewable Energy', 'Sustainable Agriculture', 'Urban Farming', 'Climate Tech', 'GIS & Remote Sensing', 'Circular Economy']}/>
        <Panel title="Application Tracker" items={['Not Applied', 'Applied', 'Pending', 'Rejected', 'Accepted']}/>
      </aside>
    </main>
  </div>
}

function Select({value,setValue,options}){return <select value={value} onChange={e=>setValue(e.target.value)}>{options.map(o=><option key={o}>{o}</option>)}</select>}
function Stat({title,value}){return <div className="stat"><p>{title}</p><b>{value}</b></div>}
function Panel({title,items}){return <div className="panel"><h3>{title}</h3>{items.map(i=><span key={i}>{i}</span>)}</div>}
function JobCard({job}){return <article className="card">
  <div className="top"><div><div className="chips"><span>{job.type}</span><span>{job.sector}</span><span>{job.mode}</span></div><h2>{job.title}</h2><p className="company"><Briefcase size={15}/>{job.company}</p></div><a className="apply" href={job.applyLink} target="_blank">Apply <ExternalLink size={15}/></a></div>
  <p className="desc">{job.description}</p>
  <div className="meta"><p><MapPin size={15}/>{job.location}</p><p><CalendarDays size={15}/>Deadline: {job.deadline}</p><p><Globe size={15}/>{job.language}</p><p>Salary: {job.salary}</p></div>
  <div className="skills">{(job.skills || []).map(s=><span key={s}>{s}</span>)}</div>
  <div className="match"><p><b>Why match:</b> {job.match}</p><p><b>Sponsorship:</b> {job.sponsorship}</p><p><b>Status:</b> {job.status}</p><p><b>Source:</b> {job.source}</p></div>
</article>}

createRoot(document.getElementById('root')).render(<App />);

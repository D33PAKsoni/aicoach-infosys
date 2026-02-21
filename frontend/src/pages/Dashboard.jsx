import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { DashHeader } from '../components/DashHeader.jsx'
import '../styles/Dashboard.css'
import { History, User, FileText, BarChart, ClipboardList } from "lucide-react";
import Resume from '../components/Resume.jsx';
import MockInterview from '../components/MockInterview.jsx';
import Statistics from '../components/Statistics.jsx';
import Profile from '../components/Profile.jsx';
import Records from '../components/Records.jsx';


const Dashboard = () => {
  const [selected, setSelected] = useState("stats"); 
  const componentMap = { resume: <Resume />, interview: <MockInterview />, records: <Records />, stats: <Statistics />, profile: <Profile /> };


  return (
    <div className="dashboard-container">
      <DashHeader />
      <div className="video-background">
        <video
          autoPlay
          muted
          loop
        >
          <source src="src/assets/videoplayback3.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="dashboard-overlay">
        <div className="quick-menu">
          {/* <div className={`menu-div ${selected === "profile" ? "selected" : ""}`} onClick={() => setSelected("profile")}>
            <User size={32} color="black" />
            <p>User</p>
          </div>
          <div className={`menu-div ${selected === "records" ? "selected" : ""}`} onClick={() => setSelected("records")}>
            <History size={32} color="black" />
            <p>Records</p>
          </div> */}
          <div className={`menu-div ${selected === "resume" ? "selected" : ""}`} onClick={() => setSelected("resume")}>
            <FileText size={32} color="black" />
            <p>Resume Match</p>
          </div>
          <div className={`menu-div ${selected === "stats" ? "selected" : ""}`} onClick={() => setSelected("stats")}>
            <BarChart size={32} color="black" />
            <p>Statistics</p>
          </div>
          <div className={`menu-div ${selected === "interview" ? "selected" : ""}`} onClick={() => setSelected("interview")}>
            <ClipboardList size={32} color="black" />
            <p>Mock Interview</p>
          </div>
        </div>
        <div className="menu-overview">
          {selected ? componentMap[selected] : <p>Please select an item above.</p>}
        </div>
      </div>
    </div>
  )
}

export default Dashboard;
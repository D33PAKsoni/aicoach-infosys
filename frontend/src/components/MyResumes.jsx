import React, { useState, useEffect, useContext } from 'react';
import API from '../api';
import { AuthContext } from "../context/AuthContext";
import { FilePlus, FileText, Trash2 } from 'lucide-react';

const MyResumes = () => {
    const { user } = useContext(AuthContext);
    const [resumes, setResumes] = useState([]);

    const fetchResumes = async () => {
        const res = await API.get(`/resumes?user_id=${user.id}`);
        setResumes(res.data);
    };

    useEffect(() => { if (user) fetchResumes(); }, [user]);

    const handleUpload = async (e) => {
        const formData = new FormData();
        formData.append("file", e.target.files[0]);
        formData.append("user_id", user.id);
        await API.post("/upload-resume", formData);
        fetchResumes();
    };

    return (
        <div className="my-resumes">
            <h3>My Resume Library</h3>
            <label className="upload-lib-btn">
                <FilePlus /> Upload New Resume
                <input type="file" hidden onChange={handleUpload} />
            </label>
            <div className="resume-list">
                {resumes.map(r => (
                    <div key={r.id} className="resume-item">
                        <FileText /> <span>{r.file_name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default MyResumes;
import React, { useState, useEffect, useContext } from 'react';
import API from '../api';
import { AuthContext } from "../context/AuthContext";
import { FilePlus, FileText, Trash2, Loader2, X, Eye } from 'lucide-react';
import '../styles/MyResumes.css';

const MyResumes = () => {
    const { user } = useContext(AuthContext);
    const [resumes, setResumes] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [previewName, setPreviewName] = useState("");

    const fetchResumes = async () => {
        try {
            const res = await API.get(`/resumes?user_id=${user.id}`);
            setResumes(res.data);
        } catch (err) { console.error("Error fetching resumes", err); }
    };

    useEffect(() => { if (user) fetchResumes(); }, [user]);

    const handleUpload = async (e) => {
        if (!e.target.files[0]) return;
        setUploading(true);
        const formData = new FormData();
        formData.append("file", e.target.files[0]);
        formData.append("user_id", user.id);
        try {
            await API.post("/upload-resume", formData);
            fetchResumes();
        } catch (err) { alert("Upload failed"); }
        finally { setUploading(false); }
    };

    const handleDelete = async (e, resumeId) => {
        e.stopPropagation();
        if (window.confirm("Are you sure?")) {
            try {
                await API.delete(`/resumes/${resumeId}`);
                setResumes(resumes.filter(r => r.id !== resumeId));
            } catch (err) { alert("Delete failed"); }
        }
    };

    const handlePreview = async (resumeId, fileName) => {
        try {
            const response = await API.get(`/resumes/download/${resumeId}`, { responseType: 'blob' });
            const fileUrl = URL.createObjectURL(response.data);
            setPreviewUrl(fileUrl);
            setPreviewName(fileName);
        } catch (err) {
            alert("Could not load preview.");
        }
    };

    const closePreview = () => {
        URL.revokeObjectURL(previewUrl); 
        setPreviewUrl(null);
        setPreviewName("");
    };

    return (
        <div className="my-resumes-container">
            <div className="library-header">
                <h3 className="library-title">My Resume Library</h3>
                <label className="upload-lib-btn">
                    {uploading ? <Loader2 className="spinning" size={18} /> : <FilePlus size={18} />}
                    <span>{uploading ? "Uploading..." : "Upload New"}</span>
                    <input type="file" accept='.pdf,.doc,.docx,.txt' hidden onChange={handleUpload} disabled={uploading} />
                </label>
            </div>

            <div className="resume-grid">
                {resumes.map(r => (
                    <div key={r.id} className="resume-card" onClick={() => handlePreview(r.id, r.file_name)}>
                        <div className="resume-info">
                            <FileText className="file-icon" />
                            <span className="file-name">{r.file_name}</span>
                        </div>
                        <div className="card-actions">
                            <Eye size={18} className="view-icon" />
                            <button className="delete-resume-btn" onClick={(e) => handleDelete(e, r.id)}>
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {previewUrl && (
                <div className="preview-overlay" onClick={closePreview}>
                    <div className="preview-content" onClick={(e) => e.stopPropagation()}>
                        <div className="preview-header">
                            <span>{previewName}</span>
                            <button onClick={closePreview} className="close-btn"><X /></button>
                        </div>
                        <iframe src={previewUrl} title="Resume Preview" width="100%" height="100%" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyResumes;


import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Calendar, Clock, Award, X, ChevronRight, BarChart3, MessageSquareText } from 'lucide-react';
import '../styles/Statistics.css';
import { AuthContext } from "../context/AuthContext";

const Statistics = () => {
    const [sessions, setSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/get-sessions?user_id=${user.id}`);
                setSessions(response.data);
            } catch (err) {
                console.error("Error fetching sessions:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSessions();
    }, []);

    const handleSessionClick = async (session) => {
        setDetailsLoading(true);
        try {
            const response = await axios.get(`http://localhost:8000/session-details/${session.id}`);
            setSelectedSession({ ...session, turns: response.data });
        } catch (err) {
            console.error("Error fetching turn details:", err);
        } finally {
            setDetailsLoading(false);
        }
    };

    if (loading) return <div className="stats-loader"><BarChart3 className="spinning" /> Loading Records...</div>;

    return (
        <div className="statistics-page">
            <h2 className="stats-title">Interview History</h2>
            <div className="sessions-grid">
                {sessions.length > 0 ? (
                    sessions.map((session) => (
                        <div key={session.id} className="session-card" onClick={() => handleSessionClick(session)}>
                            <div className="card-header">
                                <Calendar size={18} />
                                <span>{new Date(session.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="card-body">
                                <div className="session-meta">
                                    <span><MessageSquareText size={14} /> {session.turn_count || 0} Questions</span>
                                </div>
                            </div>
                            <div className="card-footer">
                                <span>View Details</span>
                                <ChevronRight size={16} />
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-data">No interview sessions found.</p>
                )}
            </div>

            {selectedSession && (
                <div className="modal-overlay" onClick={() => setSelectedSession(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <div>
                                <h3>Session Details</h3>
                            </div>
                            <button className="close-btn" onClick={() => setSelectedSession(null)}><X /></button>
                        </div>
                        
                        <div className="modal-scroll-area">
                            {detailsLoading ? (
                                <div className="details-loader">Fetching QnA pairs...</div>
                            ) : (
                                selectedSession.turns?.map((turn, index) => (
                                    <div key={turn.id} className="turn-detail-card">
                                        <div className="turn-number">Question {index + 1}</div>
                                        <div className="qna-section">
                                            <p className="turn-q"><strong>Q:</strong> {turn.question}</p>
                                            <p className="turn-a"><strong>A:</strong> {turn.answer}</p>
                                        </div>
                                        <div className="turn-metrics-row">
                                            <div className="metric-tag">WPM: <span>{turn.wpm}</span></div>
                                            <div className="metric-tag">Accuracy: <span>{turn.accuracy}%</span></div>
                                            <div className="metric-tag">Behavior: <span>{turn.dominant_behavior}</span></div>
                                            <div className="metric-tag filler">Fillers: <span>{turn.fillers || "None"}</span></div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Statistics;
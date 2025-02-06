import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Body from './Chat/Body';
import { HubProvider } from './HubContext';

const App = () => {
    const API_URL = process.env.REACT_APP_API_URL;
    const hubUrl = `http://${API_URL}/chatHub`;
    const token = localStorage.getItem('token');
    return (
        <HubProvider hubUrl={hubUrl} accessToken={token}>
            <Router>
                <Routes>
                    <Route path="/" element={<Body />} />
                </Routes>
            </Router>
        </HubProvider>
    );
};

export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Body from './Chat/Body';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Body />} />
            </Routes>
        </Router>
    );
};

export default App;

import React from 'react';
import EmpireBar from './components/EmpireBar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Home from './pages/Home';
import Article from './pages/Article';
import NewsArticle from './pages/NewsArticle';
import Category from './pages/Category';
import Admin from './pages/Admin';
import './index.css';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <EmpireBar />
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/article/:id" element={<Article />} />
            <Route path="/news/:id" element={<NewsArticle />} />
            <Route path="/category/:catId" element={<Category />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;

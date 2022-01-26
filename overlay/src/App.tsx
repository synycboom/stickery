import { Routes, Route } from 'react-router-dom';
import SignInPage from './pages/SignInPage';
import HomePage from './pages/HomePage';

import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/" element={<HomePage />} />
    </Routes>
  );
}

export default App;

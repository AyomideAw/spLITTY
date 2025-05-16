// import Home from './pages/Home';

// function App() {
//   return <Home />;
// }

// export default App;

// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SplitDetail from './components/SplitDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/split/:id" element={<SplitDetail />} />
      </Routes>
    </Router>
  );
}

export default App;

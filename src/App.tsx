import React from 'react';
import './App.css';
import UserList from './components/UserList';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserPosts from './components/UserPosts';

const App: React.FC = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<UserList />} />
          <Route path="/user-posts/:userId" element={<UserPosts id={0} title={''} body={''} tags={[]} reactions={0} />} />
        </Routes>
      </Router>
    </>
  );
}



export default App;

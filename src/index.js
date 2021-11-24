import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {BrowserRouter} from 'react-router-dom'
import AuthProvider from './context/AuthContext'
import GoalProvider from './context/GoalContext'
import Nav from './components/nav/Nav'

ReactDOM.render(
  <AuthProvider>
    <GoalProvider>
      <BrowserRouter>
        <React.StrictMode>
          <Nav />
        </React.StrictMode>
      </BrowserRouter>
    </GoalProvider>
  </AuthProvider>,
  document.getElementById('root')
);


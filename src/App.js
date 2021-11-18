import './App.css';
import Nav from './components/nav/Nav';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import About from './components/pages/About'
import NewGoal from './components/pages/CreateNewGoal'
import ViewGoal from './components/pages/ViewGoal'
import ViewGoals from './components/pages/ViewGoals'
import Account from './components/pages/Account'
import SigninForm from './components/forms/SigninForm';
import { useAuthContext } from './context/AuthContext';
import green from './images/green.png'

function App() {
  const {currentUser} = useAuthContext()
  return (
    <>
    <div>
      {currentUser == null ? <SigninForm /> : 
      <h2>Welcome back.</h2>}
    </div>
    <div className="flexColumn">
        <h3>Achieve your goals via an effective goal setting process.</h3>
        {currentUser === null ? <div className="flexRow">
          <input type="button" value="Learn more"></input>
          <input type="button" value="Start now"></input>
        </div> : 
        <div className="flexRow">
          <input type="button" value="View goals"></input>
          <input type="button" value="New goal"></input>
        </div>}
    </div>
    </>
  );
}

export default App;

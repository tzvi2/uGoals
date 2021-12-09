import {useEffect} from 'react'
import './App.css';
import Nav from './components/nav/Nav';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import About from './components/pages/About'
import NewGoal from './components/pages/CreateNewGoal'
import ViewGoal from './components/pages/ViewGoal'
import ViewGoals from './components/pages/ViewGoals'
import Account from './components/pages/Account'
import GoalCard from './components/GoalCard'
import LatestGoalCard from './components/LatestGoalCard'
import SigninForm from './components/forms/SigninForm';
import { useAuthContext } from './context/AuthContext';
import { useGoalContext } from './context/GoalContext';
import green from './images/green.png'

import {Link} from 'react-router-dom'

function App() {
  const {authUser, authLoading, currentUsersGoals, userInfo, authStateLoading} = useAuthContext()
  //const {getMostRecentGoal} = useGoalContext()
  


  return (
    <>
    {!authStateLoading && <div className="homepage">
    
      { authUser === null ? <div className="homecard1">
        <SigninForm />
      </div> 
      :
      <div className="homecard2">
        <h2 className="welcome">Welcome {authUser.displayName}</h2>
        {userInfo && userInfo.goalsCreated > 0 && <LatestGoalCard />}
      </div> }
     
      <div className="homecard3">
          {authUser === null ? <>
          <h2 className="home">Achieve your goals with research-backed goal setting.</h2>
          <Link className="home" id="learnMore" to="/about">Learn More</Link>
          <Link className="home" id="startNow" to="/signup">Start Now</Link>
          </>
          :
          <>
          {userInfo && userInfo.goalsCreated > 0 && <Link className="home" id="learnMore" to="/viewgoals">View your Goals</Link>}
          <Link className="home" id="startNow" to="/newgoal">New Goal +</Link>
          </>}
      </div>

    </div>}
    </>
  );
}

export default App;

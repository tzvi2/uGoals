import {useEffect, useState} from 'react'
import './App.css';
import LatestGoalCard from './components/LatestGoalCard'
import SigninForm from './components/forms/SigninForm';
import { useAuthContext } from './context/AuthContext';
import { useGoalContext } from './context/GoalContext';
import {Link} from 'react-router-dom'
import DueCard from './components/ActionsCard';
import { getCurrentStart } from './utils/dates';

function App() {
  const {authUser, userInfo, authStateLoading} = useAuthContext()
  const {currentUsersGoals, actions, saveGoal} = useGoalContext()
  
  return (
    <>
    {!authStateLoading && <>
    <div className='homepage_top'>
      {authUser !== null && <h2 className="welcome">Welcome {authUser.displayName}</h2>}
      </div>
      <div className="homepage_bottom">
      <div className='crossbar'></div>
      {authUser === null ? 
      <div className="signincard">
        <SigninForm />
      </div> 
      :
      <>
      
      {Object.keys(actions).map(key => {
        if (Object.keys(actions[key]).length > 0) {
          return (
            <DueCard 
              period={key}
              data={actions[key]}
              key={key}
            />
          )
        }
      })}  
      </>}

      <div className="landingcard">
          {authUser === null ? <>
          <h2 className="home">Achieve your goals with research-backed goal setting.</h2>
          <Link className="home" id="learnMore" to="/about">Learn More</Link>
          <Link className="home" id="startNow" to="/signup">Start Now</Link>
          </>
          :
          <>
          
          {userInfo && userInfo.goalsCreated > 0 && <Link className="home" id="learnMore" to="/viewgoals">View your Goals</Link>}
          {userInfo && userInfo.goalsCreated === 0 && <p className="pulse">Create your first goal</p>}
          <Link className="home" id="startNow" to="/newgoal">New Goal +</Link>
          </>}
      </div>
      
    </div></>}
    </>
  );
}

export default App;

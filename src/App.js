import {useEffect} from 'react'
import './App.css';
import LatestGoalCard from './components/LatestGoalCard'
import SigninForm from './components/forms/SigninForm';
import { useAuthContext } from './context/AuthContext';
import { useGoalContext } from './context/GoalContext';


import {Link} from 'react-router-dom'

function App() {
  const {authUser, userInfo, authStateLoading} = useAuthContext()
 
  return (
    <>
    {!authStateLoading && <div className="homepage">
    
      {authUser === null ? <div className="homecard1">
        <SigninForm />
      </div> 
      :
      <div className="homecard2">
        <h2 className="welcome">Welcome {authUser.displayName}</h2>
        <LatestGoalCard />
      </div> }

      <div className="crossbar"></div>
     
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

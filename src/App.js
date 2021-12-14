import {useEffect} from 'react'
import './App.css';
import LatestGoalCard from './components/LatestGoalCard'
import SigninForm from './components/forms/SigninForm';
import { useAuthContext } from './context/AuthContext';
import { useGoalContext } from './context/GoalContext';


import {Link} from 'react-router-dom'
import DueCard, {renderDueActions} from './components/DueCard';

function App() {
  const {authUser, userInfo, authStateLoading} = useAuthContext()
  const {currentUsersGoals, dueActions} = useGoalContext()

  return (
    <>
    {!authStateLoading && <div className="homepage">

      {authUser === null ? <>
        <SigninForm />
      </> 
      :
      <>
        <h2 className="welcome">Welcome {authUser.displayName}</h2>
        {currentUsersGoals && Object.keys(currentUsersGoals).length > 0 && <>
        {Object.entries(dueActions).map(([k, v], i) => {
            //console.log('k', k, 'v', v)
            if (Object.keys(v).length > 0) {
              return (
                <DueCard 
                  days={k === "day" ? 1 : k === "week" ? 7 : 30}
                  key={i}
                  actions={v}
                />
              )
            }
        })}
        </>}
      </>}

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

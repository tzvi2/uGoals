import {useEffect} from 'react'
import './App.css';
import LatestGoalCard from './components/LatestGoalCard'
import SigninForm from './components/forms/SigninForm';
import { useAuthContext } from './context/AuthContext';
import { useGoalContext } from './context/GoalContext';


import {Link} from 'react-router-dom'
import DueCard from './components/DueCard';

function App() {
  const {authUser, userInfo, authStateLoading} = useAuthContext()
  const {currentUsersGoals, actions, saveGoal} = useGoalContext()

  const handleQuick = async () => {
    try {
      await saveGoal(authUser.uid, {
        title: "quick goal",
        currentNumber: 23,
        targetNumber: 52,
        deadline: "2021-12-26",
        splitTime: "day",
        perPeriodSummary: "some fake ppsummary",
        actions: {
          twefe42: {
            createdAt: 2382359,
            name: "da ting",
            number: 613
          },
          tw34jt2: {
            createdAt: 23823559,
            name: "anuda ting",
            number: 1
          },
        },
        summary: "summary",
        complete: false
    })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
    {!authStateLoading && <div className="homepage">

      {authUser === null ? <>
        <SigninForm />
      </> 
      :
      <>
        <h2 className="welcome">Welcome {authUser.displayName}</h2>
        {actions && Object.keys(actions).length > 0 && <>
        {Object.entries(actions).map(([period, actionData], i) => {
          if (Object.keys(actionData).length > 0) {
            //console.log("actionData", actionData)
            return (
                  <DueCard 
                    period={period}
                    key={i}
                    actions={actionData}
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
          <button onClick={handleQuick}>Quick goal</button>
          </>}
      </div>

    </div>}
    </>
  );
}

export default App;

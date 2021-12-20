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
  

  const handleQuick = async () => {
    try {
      await saveGoal(authUser.uid, {
        title: "anuda quik goal",
        currentNumber: 23,
        targetNumber: 52,
        deadline: "2021-12-26",
        splitTime: "day",
        perPeriodSummary: "some fake ppsummary",
        actions: {
          twefe42: {
            createdAt: 2382359,
            name: "some ting",
            number: 613
          },
          tw34jt2: {
            createdAt: 23823559,
            name: "Sam Ting Wong",
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
        {Object.keys(actions).map(key => {
          if (Object.keys(actions[key]).length > 0) {
            //console.log(actions, key, )
            return (
              <DueCard 
                period={key}
                data={actions[key]}
                key={key}
              />
            )
          }
          
          
        })}
      </>
      }

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

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
import green from './images/green.png'
import {Link} from 'react-router-dom'

function App() {
  const {authUser} = useAuthContext()
  return (
    <>
      {/* <div id="ball"></div> */}
      {authUser == null ? 
      <SigninForm /> : 

        <form className="flexColumn"> 
            <p className="welcome home">Welcome back {authUser.displayName}</p>
            <LatestGoalCard />
            {/* {authUser?.firstLogin &&<p>Your account has been created.</p>} */}
        </form>}
 
          <div className="flexColumn tan">

              {!authUser ? 
              <>
              <h2 className="home">Achieve your goals with research-backed goal setting.</h2>
              <Link className="home" id="learnMore" to="/about">Learn More</Link>
              <Link className="home" id="startNow" to="/signup">Start Now</Link>
              </>
              :
              <>
              <Link className="home" id="learnMore" to="/viewgoals">View your Goals</Link>
              <Link className="home" id="startNow" to="/newgoal">New Goal +</Link>
              </>
              }
          </div>
    </>
  );
}

export default App;

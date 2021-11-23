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
import {Link} from 'react-router-dom'

function App() {
  const {authUser} = useAuthContext()
  return (
    <div className="homePage">
      {/* <div id="ball"></div> */}
      {authUser == null ? 
      <SigninForm /> : 
      <div className="flexRow">
        <form className={`flexColumn`}> 
            <p className="welcome">Welcome back {authUser.displayName}</p>
            {/* {authUser?.firstLogin &&<p>Your account has been created.</p>} */}
        </form>
      </div>}
 
        <div className="flexRow">
          <div className="flexColumn">
            {!authUser && <h2>Achieve your goals with research-backed goal setting.</h2>}
            <div className="col">
              {!authUser ? 
              <>
              <Link id="learnMore" to="/about">Learn More</Link>
              <Link id="startNow" to="/signup">Start Now</Link>
              </>
              :
              <>
              <Link id="learnMore" to="/viewgoals">View your Goals</Link>
              <Link id="startNow" to="/newgoal">New Goal +</Link>
              </>
              }
            </div>
          </div>
        </div>
    </div>
  );
}

export default App;

import Navbar from "./components/navbar";
import {BrowserRouter as Router, Route, Switch, useLocation} from 'react-router-dom';
import Home from "./pages/home";
import Footer from "./components/footer";
import BuyCover from "./pages/buy-cover";
import Individual from "./pages/plans/individual";
import SME from "./pages/plans/sme";
import RenewCover from "./pages/plans/renew-cover";
import Success from "./pages/plans/shared/success";
import Failure from "./pages/plans/shared/failure";
import About from "./pages/about";
import Contact from "./pages/contact";
import Privacy from "./pages/privacy";
import Terms from "./pages/terms";
import IndividualLoan from "./pages/plans/loan/individualLoan";
import OTP from "./pages/plans/loan/otp";
import Family from "./pages/plans/family";
import Elderly from "./pages/plans/elderly";
import ElderlyLoan from "./pages/plans/loan/elderlyLoan";
import FamilyLoan from "./pages/plans/loan/familyLoan";
import SMELoan from "./pages/plans/loan/smeLoan";

//Lagos
import IndividualLagos from "./pages/plans/lagos-plans/individual";


//Oyo
import IndividualOyo from "./pages/plans/oyo-plans/individual";


function App() {

  return (
    <Router>
      <div className="App">
        <Navbar></Navbar>

        <div className="content">
          <Switch>
            <Route exact path="/">
              <Home></Home>
            </Route>

            {/* Functional */}
            <Route exact path="/buy-cover">
              <BuyCover></BuyCover>
            </Route>
            <Route path="/buy-cover/individual">
              <Individual></Individual>
            </Route>
            <Route path="/buy-cover/family">
              <Family></Family>
            </Route>
            <Route path="/buy-cover/elderly">
              <Elderly></Elderly>
            </Route>
            <Route path="/buy-cover/sme">
              <SME></SME>
            </Route>
            <Route path="/buy-cover/renew">
              <RenewCover></RenewCover>
            </Route>


            {/* Loan Route */}
            <Route path="/buy-cover/individual-loan">
              <IndividualLoan></IndividualLoan>
            </Route>
            <Route path="/buy-cover/elderly-loan">
              <ElderlyLoan></ElderlyLoan>
            </Route>
            <Route path="/buy-cover/family-loan">
              <FamilyLoan></FamilyLoan>
            </Route>
            <Route path="/buy-cover/sme-loan">
              <SMELoan></SMELoan>
            </Route>

            
            {/* Lagos Route*/}
            <Route path="/buy-cover/lagos/individual">
              <IndividualLagos></IndividualLagos>
            </Route>
            


            {/* OYO Route*/}
            <Route path="/buy-cover/oyo/individual">
              <IndividualOyo></IndividualOyo>
            </Route>
            

            {/* Transaction */}
            <Route exact path="/payment/success">
                <Success></Success>
            </Route>
            <Route exact path="/payment/failure">
                <Failure></Failure>
            </Route>

            {/* Static Pages */}
            <Route exact path="/about">
              <About></About>
            </Route>
            <Route exact path="/contact">
              <Contact></Contact>
            </Route>
            <Route exact path="/privacy">
              <Privacy></Privacy>
            </Route>
            <Route exact path="/terms">
              <Terms></Terms>
            </Route>
            <Route exact path="/validate">
              <OTP></OTP>
            </Route>
            
          </Switch>
        </div>

        <Footer></Footer>
      </div>

      
           

    </Router>
  );
}

export default App;

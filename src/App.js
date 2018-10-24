
import React from "react";
import { BrowserRouter as Router, Route } from 'react-router-dom'
import styled from "styled-components";
import ChartView from './ChartView';
import Edit from './Edit';

const AppContainer = styled.div`
  display: flex;
  
  height: 100vh;
 
`;

const App = () => {
  return (
    
  <Router>
    <AppContainer>
      <Route exact path="/:chartview/edit" component={Edit}/>
      <Route exact path="/:chartview" component={ChartView}/>
    </AppContainer>
  </Router>
  )
}
export default App;
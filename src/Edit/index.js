import React from "react";
import styled from "styled-components"

import EditChart from './EditChart';

const Container = styled.div`
  width:100%;
  height:100%;
  background-color: #ff000077;
  display:flex;
  flex-wrap:wrap;
  

`;
class Edit extends React.Component {
  constructor() {
    super();
    this.state = {
      value: '',
      charts:[]
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addChart = this.addChart.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }
  addChart(){
    
    this.setState({charts:[...this.state.charts,<p>tt</p>]});
  }
  
  render() {
    return (
    <Container>
      {
        this.state.charts.map( i=>{
          return (<EditChart/>)
        }

        )
      }
      <p></p>
      <button onClick={this.addChart}>
        Add chart
      </button>
      </Container>

      
      )
  }
}
export default Edit;
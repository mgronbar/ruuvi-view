import React,{Fragment} from "react";
import { Link } from 'react-router-dom';
import styled from "styled-components"
import { connect } from 'react-redux';
import { bool,number,string, shape,func, arrayOf} from "prop-types";
import { fetchData } from "../actions/DataFetch";
import { fetchConfig,fetchConfigPost } from "../actions/ConfigFetch";
import Select from 'react-select'
import Chart from "../Chart";
import { ChartContainer, dataMap } from "../ChartView";
import idx from 'idx';

const PropTypes={
  
  dispatch: func.isRequired,
  match:shape({
    
    params:shape({id:string})
  }),
  loading: bool,
  start: number,
  end: number,
  config:shape({
    tagids:arrayOf(shape({})),
    charts:arrayOf(shape({}))
  }),
  data:shape({}),
}

const defaultProps ={
  loading: true,
  end: Math.round(new Date().getTime() / 1000),
  start: Math.round(new Date().getTime() / 1000) - 7 * 24 * 3600,
  config:{
    tagids:[],
    charts:[]
  },
  data:{}
}

const Container = styled.div`
  width:100%;
  height:auto;
  margin: 10px;
  
`;
const Footer = styled.div`
  
  padding: 20px;
  
`;

const BorderContainer = styled.div`
  width:auto;
  height:auto;
  margin-top: 5px;
  
  margin-bottom: 5px;
  
  border-style:solid;
  border-width:1px;

  border-color:black;
  padding:1px
`;

const SideContainer = styled.div`
  width:200px;
  height:auto;
  display:flex;
  flex-direction:column;
  

`;
const HorizontalContainer = styled.div`
  
  display:flex;
  height:auto;
  flex-direction:row;
  margin-top: 5px;
  
  margin-bottom: 5px;

`;
const StyledSelect = styled(Select)`
  
  width:200px;
`

class Edit extends React.Component {
  constructor() {
    super();
    this.state = {
      value: '',
      charts:[],
      
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleLabelChange = this.handleLabelChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addChart = this.addChart.bind(this);
    this.addMeasurement = this.addMeasurement.bind(this);
    this.saveChart = this.saveChart.bind(this);
    this.removeChart = this.removeChart.bind(this);
    this.valueSelector = this.valueSelector.bind(this);
  }

  saveChart(){
    const {
      dispatch,
      match: {
      params: { chartview: address }
    }} = this.props;

    dispatch(fetchConfigPost({ address,charts:this.state.charts,tagids:this.state.tagids }));


  }

  handleChange({label,value},{name}) {
    // 
    const [index,axis,subindex,dataKey]=name.split('-');
    const charts = this.state.charts;
  
    charts[index][axis][subindex][dataKey]={label,value};
    
    this.setState({charts})
    
  }

  valueSelector(chart,index,axis) {
    const options = Object.entries(dataMap).map(([label,value])=>({value:value.dataKey,label}));
    
  return (
    <div>
    {
      chart[axis].map( (item,subIndex)=>
      (
      <div key={`if-${subIndex}`}>
        <StyledSelect 
            name={`${index}-${axis}-${subIndex}-tagid`}
            options={this.state.tagids} 
            onChange={this.handleChange}
            value={this.state.tagids.filter(option => option.value === chart[axis][subIndex].tagid.value)}
            />
          <StyledSelect 
            name={`${index}-${axis}-${subIndex}-dataKey`}
            options={subIndex===0?options:options.filter(option => option.value === chart[axis][0].dataKey.value )} 
            onChange={this.handleChange}
            value={options.filter(option => option.value === chart[axis][0].dataKey.value )}
            />
      </div>
      ))
      
    }
    <button name={`${axis}-${index}`} onClick={this.addMeasurement}>
      Add measurement
    </button>
    </div>
  )
  }

  handleLabelChange(event) {
    
    const name = event.target.name
    const value = event.target.value
    
    const {tagids} =  this.state;
    const newTagids = tagids.map( opt => {
       console.log(opt)
      return { 
        value: opt.value, 
        label: opt.value===name?value:opt.label
      };
    });
    
    this.setState({tagids:newTagids})
    
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }
  addChart(){
    
    this.setState({charts:[...this.state.charts,{left:[/*{dataKey:'Temperature',tagid:''}*/],right:[/*{dataKey:'Humidity',tagid:''}*/]}]});
  }
  addMeasurement(event){
    
    const [axis,id]=event.target.name.split('-');
    const charts = this.state.charts;
    charts[id][axis].push({dataKey:'',tagid:''});
    //charts
    this.setState({charts});
  }

  removeChart(event){
    console.log(event.target.name)
    
    const charts = this.state.charts;
    charts.splice(parseInt(event.target.name,10),1);
    this.setState({charts});
  }
  componentDidMount() {
    
    const {
      dispatch,
      start,
      end,
      match: {
        params: { chartview: address}
      },
      
    } = this.props;
    
    dispatch(fetchConfig({ location: address }));
    dispatch(fetchData({ start, end, address }));
  }

  componentWillReceiveProps(nextProps) {
    const {
      dispatch,
      match: {
        params: { chartview: address}
      },

    } = this.props;
    

    const { start, end, config,data } = nextProps;
    if (start !== this.props.start || end !== this.props.end) {
      dispatch(fetchData({ start, end, address }));
    }
    const charts = idx(this.props,_=>_.config.charts)||[];
    const savedTagids =  idx(config,_=>_.tagids)||[];
    const noConfiguredTagids= (Object.keys(data||{}).map(
      tagid=>({value:tagid,label:tagid}))||[])
      .filter(tag=>!savedTagids.find(i=>i.value===tag.value))
    
    this.setState({charts,tagids:[...savedTagids,...noConfiguredTagids]})
  }

  
  render() {
    const {
      match: {
        params: { chartview: address}
      },

    } = this.props;
    
        
    return (
    <Container>
      <Fragment>
        <Link to={`/${address}`} >Back</Link>
        <div>
          { this.state.tagids && this.state.tagids.map((tagid,index) =>{
    
              return (<div key={`tag-key-${index}`}><span>{`Tag ID: ${tagid.value} `}</span>
                <label>
                    Name:
                <input name={tagid.value} type="text" value={tagid.label} onChange={this.handleLabelChange} />
              </label>
            </div>
              )
            }
          )
          }
        </div>
      {
        
        
        this.props.data && Object.keys(this.props.data).length && this.state.charts.map( (chart,index)=>{
          return (
          <BorderContainer key={`border-name-${index}`}>
          <Fragment>
            <div>
              <button name={index} onClick={this.removeChart}>Remove this</button>
            
                  </div>
            <HorizontalContainer>
              <SideContainer>
                {this.valueSelector( chart,index,'left')}
              </SideContainer>
              <ChartContainer>
                {idx(chart,_=>_.left[0].tagid) &&
                 idx(chart,_=>_.left[0].dataKey) &&
                (<Chart
                    data={this.props.data}
                    left={chart.left}
                    right={chart.right}
                    
                    
                    name={`chart-${index}`}
                    key={`chart-${index}-${index}`}
                  />)} 
            </ChartContainer>
            <SideContainer>
            {this.valueSelector( chart,index,'right')}
            </SideContainer> 
            </HorizontalContainer>
          </Fragment>  
          </BorderContainer>  
          )
        }
        
        )
      }
      </Fragment>
      <Footer>
        <button onClick={this.addChart}>
          Add chart
        </button>
        <button onClick={this.saveChart}>
          Save
        </button>
      </Footer>
      </Container>

      
      )
  }
}

const mapStateToProps = props => {
  const {
    DataFetch: { data, loading, error, start, end, shift },
    ConfigFetch: { config }
  } = props;
  return {
    config,
    data,
    loading,
    start,
    end,
    shift,
    error
  };
};

Edit.propTypes=PropTypes;
Edit.defaultProps=defaultProps;
export default connect(mapStateToProps)(Edit);
import React,{Fragment} from "react";
import styled from "styled-components"
import { connect } from 'react-redux';
import { bool,number,string, shape,func, arrayOf} from "prop-types";
import { fetchData, dateChange } from "../actions/DataFetch";
import { fetchConfig,fetchConfigPost } from "../actions/ConfigFetch";
import Select from 'react-select'
import Chart from "../Chart";
import { ChartContainer, dataMap } from "../ChartView";
import idx from 'idx';

 



const PropTypes={
  match:shape({
    dispatch: func.isRequired,
    params:shape({id:string})
  }),
  loading: bool,
  start: number,
  end: number,
  config:shape({
    tagids:arrayOf(shape({})),
    charts:arrayOf(shape({}))
  }),
  data:shape({})
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
  height:100%;
  
  display:flex;
  flex-direction:column;
  

`;
const SideContainer = styled.div`
  width:200px;
  height:100%;
  
  display:flex;
  flex-direction:column;
  

`;
const HorizontalContainer = styled.span`
  
  display:flex;
  
  flex-direction:row;

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
    this.saveChart = this.saveChart.bind(this);
  }

  saveChart(){

    const {
      dispatch,
      config,
      match: {
      params: { chartview: address }
    }}=this.props;

    dispatch(fetchConfigPost({ address,charts:this.state.charts,tagids:this.state.tagids }));


  }

  handleChange({label,value},{name}) {
    
    const [id,index]=name.split('-');
    const charts = this.state.charts;
    charts[index][id]=id==='tagid'?value:label;
    this.setState({charts})
    
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
    console.log(newTagids)
    this.setState({tagids:newTagids})
    
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }
  addChart(){
    
    this.setState({charts:[...this.state.charts,{left:'Temperature',right:'Humidity'}]});
  }
  componentDidMount() {
    // this.loadData(this.state);
    console.log("componentDidMount");
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
      }
    } = this.props;
    

    const { start, end, config,data } = nextProps;
    if (start !== this.props.start || end !== this.props.end) {
      dispatch(fetchData({ start, end, address }));
    }
    const charts = idx(this.props,_=>_.config.charts)||[];
    //const config = this.props.config.find((config) => config.id===id)||{charts:[{left:'Temperature',right:'Humidity'}]};
    
    const savedTagids =  idx(config,_=>_.tagids)||[];
    const noConfiguredTagids= (Object.keys(data||{}).map(
      tagid=>({value:tagid,label:tagid}))||[])
      .filter(tag=>!savedTagids.find(i=>i.value===tag.value))
      //.map(i=>({label:i,value:i}));
    
    this.setState({charts,tagids:[...savedTagids,...noConfiguredTagids]})
  }

  
  render() {
    const {
      loading,
      match: {
        params: { id }
      }
    } = this.props;
   
    const options = Object.entries(dataMap).map(([label,value])=>({value:value.dataKey,label}));
    
    
    return (
    <Container>
      <Fragment>
        <div>
          { this.state.tagids && this.state.tagids.map(tagid =>{
    
              return (<div><span>{`TAGID: ${tagid.value} `}</span>
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
          <Fragment>
            <div><StyledSelect 
                  name={`tagid-${index}`}
                  options={this.state.tagids} 
                  onChange={this.handleChange}
                  value={this.state.tagids.filter(option => option.value === chart.tagid)}
                  />
                  </div>
            <HorizontalContainer>
              <SideContainer>
                <StyledSelect 
                  name={`left-${index}`}
                  options={options} 
                  onChange={this.handleChange}
                  value={options.filter(option => option.label === chart.left)}
                  />
              </SideContainer>
              <ChartContainer>
                {chart.tagid &&(<Chart
                    data={this.props.data}
                    left={chart.left}
                    
                    right={chart.right}
                    
                    id={chart.tagid}
                    name={chart.tagid}
                    key={`chart-${index}-${index}`}
                  />)} 
            </ChartContainer>
            <SideContainer>
            <StyledSelect 
              name={`right-${index}`}
              options={options} 
              onChange={this.handleChange}
              value={options.filter(option => option.label === chart.right)}
              />
            </SideContainer> 
            </HorizontalContainer>
          </Fragment>  
          )
        }
        
        )
      }
      </Fragment>
      <div>
      <button onClick={this.addChart}>
        Add chart
      </button>
      <button onClick={this.saveChart}>
        Save
      </button>
      </div>
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
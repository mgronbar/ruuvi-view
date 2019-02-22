import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Helmet } from "react-helmet";
import idx from "idx";
import styled from "styled-components";
import Moment from "moment";
import { extendMoment } from "moment-range";
import { fetchData, dateChange } from "./actions/DataFetch";
import { fetchConfig } from "./actions/ConfigFetch";
import { func, bool, number,shape,arrayOf } from "prop-types";

import "./App.css";
import Chart from "./Chart";

const PropTypes = {
  dispatch: func.isRequired,
  loading: bool,
  start: number,
  end: number,
  shift: number,
  config:shape({
    tagids:arrayOf(shape({})),
    charts:arrayOf(shape({}))
  }),
  data:shape({})

};

const defaultProps = {
  loading: true,
  end: Math.round(new Date().getTime() / 1000),
  start: Math.round(new Date().getTime() / 1000) - 7 * 24 * 3600,
  shift: 7,
  config:{
    tagids:[],
    charts:[]
  },
  data:{}
};

export const ChartContainer = styled.div`
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  width: 100%;
  height: 400px;
  background-color: #fff;
`;

const BorderContainer = styled.div`
/*
  margin-top: 5px;
  
  margin-bottom: 5px;
  */
  padding:10px
`;

export const dataMap = {
  Temperature: {
    unit: "°C",
    dataKey: "temperature",
    domain: [
      dataMin => Math.round(dataMin * 10) / 10 - 2,
      dataMax => Math.round(dataMax * 10) / 10 + 2
    ]
  },
  Pressure: { unit: "", dataKey: "pressure",domain: [950, 1040] },
  Humidity: { unit: "%", dataKey: "humidity", domain: [0, 100] },
  Wind: {
    unit: "x",
    dataKey: "accelerationStdAvg",
    domain: [
      dataMin => Math.round(dataMin) - 2,
      dataMax => Math.round(dataMax) + 2
    ]
  },
  Battery: {
    unit: "mV",
    dataKey: "battery",
    domain: [
      dataMin => Math.round(dataMin) - 10,
      dataMax => Math.round(dataMax) + 10
    ]
  },
  RSSI: {
    unit: "mW",
    dataKey: "rssi",
    domain: [
      dataMin => Math.round(dataMin) - 10,
      dataMax => Math.round(dataMax) + 10
    ]
  },
};

const moment = extendMoment(Moment);

class ChartView extends Component {
  constructor(props) {
    super(props);
    this.prev = this.prev.bind(this);
    this.next = this.next.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.changeDuration = this.changeDuration.bind(this);
  }

  componentDidMount() {
    // this.loadData(this.state);
    console.log("componentDidMount");
    
    const {
      dispatch,
      start,
      end,
      match: {
        params: { chartview: address }
      }
    } = this.props;

    dispatch(fetchConfig({ location: address }));
    dispatch(fetchData({ start, end, address }));
  }

  componentWillReceiveProps(nextProps) {
    const {
      dispatch,
      match: {
        params: { chartview: address }
      }
    } = this.props;

    const { start, end } = nextProps;
    if (start !== this.props.start || end !== this.props.end) {
      dispatch(fetchData({ start, end, address }));
    }
  }

  prev() {
    this.handleDateChange({
      start: this.props.start - this.props.shift * 3600 * 24,
      end: this.props.end - this.props.shift * 3600 * 24,
      shift: this.props.shift
    });
  }
  next() {
    this.handleDateChange({
      start: this.props.start + this.props.shift * 3600 * 24,
      end: this.props.end + this.props.shift * 3600 * 24,
      shift: this.props.shift
    });
  }

  handleDateChange(dates) {
    const { dispatch } = this.props;
    dispatch(dateChange(dates));
  }

  changeDuration(days) {
    const dates = {
      start: this.props.end - days * 3600 * 24,
      end: this.props.end,
      shift: days
    };

    this.handleDateChange(dates);
  }

  hasNext() {
    const current = Math.round(new Date().getTime() / 1000);
    return current < this.props.end + this.props.shift * 3600 * 24;
  }

  render() {
    const {
      history:{push},
      match: {
        params: { 
          chartview: address }
      },
      config:{charts,tagids},
      data
    }=this.props;
    
    const configuredIds = charts.map(i=>i.tagid);
    const dataIds = Object.keys(data);
    const nonConfiguredIds= dataIds.filter(i=>!configuredIds.find(id=>id===i));
    const tagMap=tagids.reduce((acc,item)=>{
      acc[item.value]=item.label;
      return acc;
    },{});
    
    const firstData =data[idx(tagids,_=>_[0].value)] || [];
    const times = firstData.map(i => i.time);
    const first = Math.min(...times);
    const last = Math.max(...times);
    console.log(tagMap)
    return (
      <ChartContainer>
        <Helmet>
          <title>Ruuvi</title>
        </Helmet>
        <Fragment>
          
          <BorderContainer>
            <span> Duration </span>
            <button onClick={() => this.changeDuration(1)}> 1 day </button>
            <button onClick={() => this.changeDuration(7)}> 1 week </button>
            <button onClick={() => this.changeDuration(14)}> 2 weeks </button>
            <button onClick={() => this.changeDuration(30)}> 1 month </button>
          </BorderContainer>
          <BorderContainer>
            <button disabled={false} onClick={this.prev}>PREV</button>
            <span>
              <b>
                {" "}
                {moment(first * 1000).format("D.M.YY [klo] HH.mm")} -{" "}
                {moment(last * 1000).format("D.M.YY [klo] HH.mm")}
              </b>
            </span>
            <button disabled={this.hasNext()} onClick={this.next}>NEXT</button>
          </BorderContainer>
          <BorderContainer>
          <span><b>{` ${this.props.shift} DAY(S) `}</b></span>
          </BorderContainer>
          {!this.props.loading && this.props.data &&
            Object.keys(this.props.data).length &&
            (charts||[]).map((chart, indexChart) => {
                const dataByTag = data[chart.tagid]||[]
                const left = idx(dataByTag,_=>_[
                  dataByTag.length - 1
                ].payload[dataMap[chart.left].dataKey]);
                
                const right = idx(dataByTag,_=>_[
                  dataByTag.length - 1
                ].payload[dataMap[chart.right].dataKey]);

              
                
                return (
                  <ChartContainer key={`chart-key-${indexChart}`}>
                    <BorderContainer>
                    <div><b>{`${tagMap[chart.tagid]||chart.tagid}`}</b></div>

                    <div>{`${chart.left}:`} <b>{` ${left} ${
                      dataMap[chart.left].unit
                    }`}</b></div>
                    <div>{`${chart.right}:`} <b>{`${right} ${
                      dataMap[chart.right].unit
                    }`}</b></div>
                    </BorderContainer>
                    <Chart
                      data={data}
                      left={chart.left}
                      right={chart.right}
                      id={chart.tagid}
                      name={chart.name}
                      key={`chart-${indexChart}`}
                    />
                  </ChartContainer>
                );
              })
            }
            {
              nonConfiguredIds.map((i,index)=>
                (
                  <div key={`chart-key-${index}`}>{ `No configuration for tagid ${i} - `} </div>
                ))
            
            }
            <BorderContainer><button onClick={()=>{ console.log('--');push(`/${address}/edit`)}} >Edit</button></BorderContainer>
        </Fragment>
      </ChartContainer>
    );
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

ChartView.propTypes = PropTypes;
ChartView.defaultProps = defaultProps;

export default connect(mapStateToProps)(ChartView);

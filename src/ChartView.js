import React,{Component,Fragment} from "react";
import { connect } from 'react-redux';
import { Helmet } from "react-helmet";
import styled from "styled-components";
import Moment from "moment";
import { extendMoment } from "moment-range";
import {fetchData} from './actions/DataFetch'
import { func, bool } from 'prop-types';
import config  from './config/config.json'


import "./App.css";
import Chart from "./Chart";

const PropTypes = {
  dispatch: func.isRequired,
  loading: bool
}

const defaultProps = {
  loading: true
}

const shiftAmount = 3600 * 24 * 5;

const ChartContainer = styled.div`
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  padding: 10px;
  width: 100%;
  height: 400px;
  background-color: #fff;
`;
export const dataMap = {
  Temperature: { unit: "°C", domain: ["dataMin-5", "dataMax+5"] },
  Pressure: { unit: "mBar", domain: [980, 1030] },
  Humidity: { unit: "%", domain: [0, 100] },
  Wind: { unit: "rel", domain: ["dataMin-5", "dataMax+5"] }
};


const moment = extendMoment(Moment);

class ChartView extends Component {
  constructor(props) {
    super(props);
    const nowDateEpoc = Math.round(new Date().getTime() / 1000);
    const nowMinusWeek = nowDateEpoc - 7 * 24 * 3600;
    this.state = {
      data: [],
      isLoading: true,
      start: nowMinusWeek,
      end: nowDateEpoc,
      config: config['laivuri']
    };
    this.prev = this.prev.bind(this);
    this.next = this.next.bind(this);
  }

  componentDidMount() {
    // this.loadData(this.state);
    const {start,end}=this.state;
    const { dispatch } = this.props;
    const address = this.props.match.params.chartview;
    dispatch(fetchData({start,end, address}));
  }


  prev() {
    this.setState({
      start: this.state.start - shiftAmount,
      end: this.state.end - shiftAmount
    });
  }
  next() {
    this.setState({
      start: this.state.start + shiftAmount,
      end: this.state.end + shiftAmount
    });
  }


  render() {
    console.log("render");
    if (this.props.loading) {
      return <p>Loading ...</p>;
    }
    return (
      <ChartContainer>
        <Helmet>
          <title>Ruuvi</title>
        </Helmet>
        <Fragment>
          <div onClick={this.prev}>PREV</div>
          <div>
            {moment(this.state.start * 1000).format("D.M.Y [klo] HH.mm")}-
            {moment(this.state.end * 1000).format("D.M.Y [klo] HH.mm")}
          </div>
          <div onClick={this.next}>NEXT</div>
          {!this.props.loading &&
            this.props.data &&
            this.state.config.map((meter, indexMeter) => {
              debugger
              return meter.charts.map((chart, indexChart) => {
                const left = this.props.data[meter.id][
                  this.props.data[meter.id].length - 1
                ].payload[chart.left.dataKey];
                const right = this.props.data[meter.id][
                  this.props.data[meter.id].length - 1
                ].payload[chart.right.dataKey];
                return (
                  <ChartContainer>
                    <div>{`${meter.name}:`}</div>

                    <div>{`${chart.left.axis}: ${left} ${
                      dataMap[chart.left.axis].unit
                    }`}</div>
                    <div>{`${chart.right.axis}: ${right} ${
                      dataMap[chart.right.axis].unit
                    }`}</div>

                    <Chart
                      data={this.props.data}
                      left={chart.left}
                      right={chart.right}
                      id={meter.id}
                      name={meter.name}
                      key={`chart-${indexMeter}-${indexChart}`}
                    />
                  </ChartContainer>
                );
              });
            })}
            
        </Fragment>
      </ChartContainer>
    );
  }
}

const mapStateToProps = ({DataFetch: {  data, loading,  error }}) => ({
    data,
  loading,
  error,
});

ChartView.propTypes = PropTypes;
ChartView.defaultProps = defaultProps;
// export default ChartView;
export default connect(mapStateToProps)(ChartView);

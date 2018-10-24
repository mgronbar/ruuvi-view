import React, { Component } from "react";
import { Helmet } from "react-helmet";
import styled from "styled-components";

import "./App.css";
import Chart from "./Chart";
const {REACT_APP_API_KEY,REACT_APP_API_ENPOINT}=process.env;
console.log(process.env);

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

const sortData = data => {
  const d = data.reduce((a, { tagid, created, payload }) => {
    const std=(payload.accelerationXstd +
      payload.accelerationYstd +
      payload.accelerationZstd)/3;

    a[tagid] = a[tagid] || [];
    const i = a[tagid].length
    a[tagid] = [
      ...a[tagid], 
      {
        time: created,
        payload: {
          ...payload,
          pressure: payload.pressure / 100,
          accelerationStd:std,
          accelerationStdAvg:Math.round(100*(std+(i>0?a[tagid][i-1].payload.accelerationStd:std)+(i>1?a[tagid][i-1].payload.accelerationStd:std))/3)/100
        }
      }
    ];
    debugger
    return a;
  }, {});
  return d;
};
class ChartView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      isLoading: true,
      config: [
        {
          id: "ebfaa8ca7692",
          name: "Ulko",
          charts: [
            {
              left: { axis: "Humidity", dataKey: "humidity" },
              right: { axis: "Temperature", dataKey: "temperature" }
            },
            {
              left: { axis: "Pressure", dataKey: "pressure" },
              right: { axis: "Wind", dataKey: "accelerationStdAvg" }
            }
          ]
        },
        {
          id: "c5bb9deaaf9f",
          name: "Olohuone",
          charts: [
            {
              left: { axis: "Humidity", dataKey: "humidity" },
              right: { axis: "Temperature", dataKey: "temperature" }
            }
          ]
        },

        {
          id: "cab7aaf3557e",
          name: "Makuuhuone",
          charts: [
            {
              left: { axis: "Humidity", dataKey: "humidity" },
              right: { axis: "Temperature", dataKey: "temperature" }
            }
          ]
        }
      ]
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    const address = this.props.match.params.chartview;
    const nowDateEpoc = Math.round(new Date().getTime() / 1000);
    const nowMinusWeek = nowDateEpoc - 7 * 24 * 3600;
    fetch(
      `${REACT_APP_API_ENPOINT}?address=${address}&start=${nowMinusWeek}`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": `${REACT_APP_API_KEY}`
        }
      }
    )
      .then(response => response.json())
      .then(data => this.setState({ data: sortData(data), isLoading: false }))
      .catch(error => this.setState({ error, isLoading: false }));
  }

  render() {
    return (
      <ChartContainer>
        <Helmet>
          <title>Ruuvi</title>
        </Helmet>
        {!this.state.isLoading &&
          this.state.data &&
          this.state.config.map((meter, indexMeter) => {
            return meter.charts.map((chart, indexChart) => {
              const left = this.state.data[meter.id][this.state.data[meter.id].length-1].payload[chart.left.dataKey];
              const right = this.state.data[meter.id][this.state.data[meter.id].length-1].payload[chart.right.dataKey];
              return (
                <ChartContainer key={`inner-${indexMeter}-${indexChart}`}>
                  <span>{`${meter.name}:`}</span><br/>
                  <span>{`${chart.left.axis}: ${left} ${dataMap[chart.left.axis].unit}`}</span><br/>
                  <span>{`${chart.right.axis}: ${right} ${dataMap[chart.right.axis].unit}`}</span>
                  <Chart data={this.state.data} left={chart.left} right={chart.right} id={meter.id} name={meter.name} key={`chart-${indexMeter}-${indexChart}`} />
                </ChartContainer>
              );
            }
            )
            }
            
          )
            }
      </ChartContainer>
    );
  }
}

export default ChartView;

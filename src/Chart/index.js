import React from "react";
import { string, shape} from "prop-types";
import {
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Line,
  Legend,
  Label,
  ResponsiveContainer
} from "recharts";

import Moment from "moment";

import { extendMoment } from "moment-range";

import {dataMap} from '../ChartView'

const PropTypes = {
  id: string,
  data: shape({}),

  timeFormat: string,
  left: shape({
    axis: string,
    dataKey: string
  }),
  right: shape({
    axis: string,
    dataKey: string
  }),
};

const DefaultProps = {
  id: null,
  data: null,
  loading: true,
  timeFormat: "",
  left: null, 
  right: null,

};
const moment = extendMoment(Moment);
const tickFormatter = (date, format) =>
  moment(date * 1000).format(format || "HH.mm");
const labelFormatter = data => moment(data * 1000).format("ddd D.M.YY [klo] HH.mm");
const defineTickFormat = timeArr => {
  const min = moment(Math.min(...timeArr)*1000);
  const max = moment(Math.max(...timeArr)*1000);
  const domain = moment.range(min, max);
  
  if (domain.diff("days") <= 1) {
    return "HH:mm";
  }
  if (domain.diff("days") <= 31) {
    return "DD.MM.YY";
  }
  return "MMM YYYY";
};


class Chart extends React.Component {
  render() {
    const { left, right, id} = this.props;
    const timeArray = this.props.data[id].length
      ? this.props.data[id].map(item => item.time)
      : [];
    const timeFormat = defineTickFormat(timeArray);

    return (
      <ResponsiveContainer
        key={`chart-container-${this.props.id}`}
        width="100%"
        height="80%"
      >
        <LineChart
          key={`chart${this.props.id}`}
          data={this.props.data[id].sort((i, k) => (i.time < k.time ? -1 : 1))}
          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
        >
          <Label
            value={`Tag :${this.props.id}`}
            offset={0}
            position="insideTop"
          />
          <Legend verticalAlign="top" height={36} />
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis
            dataKey="time"
            tickFormatter={date => tickFormatter(date, timeFormat)}
          />
          {left && (
            <YAxis
              type="number"
              interval="preserveStartEnd"
              yAxisId="left"
              orientation="left"
              tickSize={5}
              tickLine={false}
              domain={dataMap[left].domain}
              unit={dataMap[left].unit}
              stroke="#00ff00"
              fontSize={12}
              left={-20}
            />
          )}
          {left && (
            <Line
              type="monotone"
              yAxisId="left"
              dot={false}
              name={`${left}`}
              dataKey={`payload.${dataMap[left].dataKey}`}
              stroke="#00ff00"
              tickFormatter={y => Math.round(y*10)/10}
            />
          )}
          {right && (
            <YAxis
              type="number"
              interval="preserveStartEnd"
              yAxisId="right"
              orientation="right"
              tickSize={5}
              tickLine={false}
              domain={dataMap[right].domain}
              unit={dataMap[right].unit}
              stroke="#ff0000"
              fontSize={12}
              left={-20}
              minTickGap={1}
              tickFormatter={y => Math.round(y*10)/10}
            />
          )}
          {right && (
            <Line
              type="monotone"
              yAxisId="right"
              dot={false}
              name={`${right}`}
              dataKey={`payload.${dataMap[right].dataKey}`}
              stroke="#ff0000"
              
            />
          )}

          <Tooltip labelFormatter={labelFormatter} />
        </LineChart>
      </ResponsiveContainer>
    );
  }
}

Chart.propTypes = PropTypes;
Chart.defaultProps = DefaultProps;

export default Chart;

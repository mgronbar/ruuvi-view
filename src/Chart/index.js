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
  })
};

const DefaultProps = {
  id: null,
  data: null,
  loading: true,
  timeFormat: "",
  left: null,
  right: null
};
const moment = extendMoment(Moment);
const tickFormatter = (date, format) =>
  moment(date * 1000).format(format || "HH.mm");
const labelFormatter = data => moment(data * 1000).format("D.M.Y [klo] HH.mm");
const defineTickFormat = timeArr => {
  const min = moment(Math.min(...timeArr));
  const max = moment(Math.max(...timeArr));
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
    const { left, right, id } = this.props;
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
              domain={dataMap[left.axis].domain}
              unit={dataMap[left.axis].unit}
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
              name={`${left.axis}`}
              dataKey={`payload.${left.dataKey}`}
              stroke="#00ff00"
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
              domain={dataMap[right.axis].domain}
              unit={dataMap[right.axis].unit}
              stroke="#ff0000"
              fontSize={12}
              left={-20}
              minTickGap={1}
            />
          )}
          {right && (
            <Line
              type="monotone"
              yAxisId="right"
              dot={false}
              name={`${right.axis}`}
              dataKey={`payload.${right.dataKey}`}
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

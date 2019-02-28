import React from "react";
import { string, shape, arrayOf } from "prop-types";
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

import { dataMap } from "../ChartView";
import idx from "idx";


const PropTypes = {
  id: string,
  data: shape({}),

  timeFormat: string,
  left: arrayOf(shape({}))
  // right: shape({
  //   axis: string,
  //   dataKey: string
  // }),
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
const labelFormatter = data =>
  moment(data * 1000).format("ddd D.M.YY [klo] HH.mm");
const defineTickFormat = timeArr => {
  const min = moment(Math.min(...timeArr) * 1000);
  const max = moment(Math.max(...timeArr) * 1000);
  const domain = moment.range(min, max);

  if (domain.diff("days") <= 1) {
    return "HH:mm";
  }
  if (domain.diff("days") <= 31) {
    return "DD.MM.YY";
  }
  return "MMM YYYY";
};

const getRowId = (key, i, item) =>
  `${key}-${i}-${item.dataKey.value}-${item.tagid.value}`;

const getRow = (item, chart,tagid) => {
  return Object.entries(chart).reduce((acc, [key, value]) => {
    
    acc = {
      ...acc,
      ...value.reduce((a,item2, i) => {
        if(item2.tagid.value!==tagid){
          return a;
        }
        return {
          ...a,
          [getRowId(key, i, item2)]: item[item2.dataKey.value]
        };
      },{})
    };
    return acc;
  }, {});
};

const enhancedata = (data, chart) => {
  const rrr = Object.entries(data)
    .reduce((acc, [tagid, mData]) => {
        mData.reduce((tmp,{ time:orgTime, payload }) => {
          const rows = getRow(payload, chart,tagid);
          const time = orgTime-(orgTime%1800);
          acc[time]={time, ...acc[time], ...rows}
          return tmp
        },{})
      return acc;
    }, {});
    
    return Object.values(rrr).sort((a, b) => a.time - b.time);
};

const getColor = (axis,i)=>({
  left: ['red','green','blue'],
  right: ['cyan','pink']
}[axis][i]); 

class Chart extends React.Component {
  render() {
    const { left, right, data } = this.props;
    //const eData = enhancedata(data, { left, right });
    
    
    const timeArray = this.props.data.map(item => item.time)
      || [];
    const timeFormat = defineTickFormat(timeArray);
    return (
      <ResponsiveContainer
        key={`chart-container-${this.props.id}`}
        width="100%"
        height="80%"
      >
        <LineChart
          key={`chart${this.props.id}`}
          data={data}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <Label
            value={`Tag :${this.props.id}`}
            offset={0}
            position="insideTop"
          />
          <Legend verticalAlign="top" height={36} />
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis
            dataKey={`time`}
            tickFormatter={date => tickFormatter(date, timeFormat)}
            angle={-45}
          />
          {left.length && (
            <YAxis
              type="number"
              interval="preserveStartEnd"
              yAxisId="left"
              orientation="left"
              tickSize={5}
              tickLine={false}
              domain={dataMap[left[0].dataKey.label].domain}
              unit={dataMap[left[0].dataKey.label].unit}
              stroke="black"
              fontSize={12}
              left={-20}
              angle={-45}
            />
          )}
          {left.map((item, i) => (
            <Line
              key={`linex-${i}`}
              type="monotone"
              yAxisId="left"
              dot={false}
              connectNulls={true}
              name={`${item.dataKey.label}-${item.tagid.label}`}
              dataKey={getRowId('left',i,item)}
              stroke={getColor('left',i)}
              tickFormatter={y => Math.round(y)}
            />
          ))}
          {right.length && idx(right,_=>_[0].dataKey) && (
            <YAxis
              type="number"
              interval="preserveStartEnd"
              yAxisId="right"
              orientation="right"
              tickSize={5}
              tickLine={false}
              domain={dataMap[right[0].dataKey.label].domain}
              unit={dataMap[right[0].dataKey.label].unit}
              stroke="black"
              fontSize={12}
              left={-20}
            />
          )}
          {right.map((item, i) => (
            <Line
              key={`liney-${i}`}
              type="monotone"
              yAxisId="right"
              dot={false}
              connectNulls={true}
              name={`${item.dataKey.label}-${item.tagid.label}`}
              dataKey={getRowId('right',i,item)}
              stroke={getColor('right',i)}
              tickFormatter={y => Math.round(y)}
            />
          ))}

          <Tooltip labelFormatter={labelFormatter} />
        </LineChart>
      </ResponsiveContainer>
    );
  }
}

Chart.propTypes = PropTypes;
Chart.defaultProps = DefaultProps;

export default Chart;

import React from 'react';
import { Avatar } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import ApiCoinford from '../class/ApiCoinford';

class OrderGraph extends React.Component {
  constructor(props) {
    super(props)
    //this.handleSuccess = this.handleSuccess.bind(this);
    this.ApiCoinford = new ApiCoinford();
    const data = [
          {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
          {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
          {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
          {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
          {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
          {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
          {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
    ];
    this.state = {
      data: data
    };
  }
  render() {
    return (
      <LineChart width={600} height={300} data={this.state.data}
            margin={{top: 5, right: 30, left: 20, bottom: 5}}>
       <XAxis dataKey="name"/>
       <YAxis/>
       <CartesianGrid strokeDasharray="3 3"/>
       <Tooltip/>
       <Legend />
       <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{r: 8}}/>
       <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
      </LineChart>
    )
  }
}
module.exports = OrderGraph;

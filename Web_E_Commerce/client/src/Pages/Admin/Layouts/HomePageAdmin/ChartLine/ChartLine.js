import classNames from 'classnames/bind';
import styles from './ChartLine.module.scss';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useEffect, useState } from 'react';
import request from '../../../../../config/Connect';

const cx = classNames.bind(styles);

function ChartLine() {
    const [dataOrder, setDataOrder] = useState([]);

    useEffect(() => {
        request.get('/api/dataorderuser').then((res) => {
            if (res?.data) {
                setDataOrder(res.data);
            }
        });
    }, []);

    const data = dataOrder.map((item) => ({
        name: item.email,
        revenue: item.sumPrice,
    }));

    return (
        <div className={cx('wrapper')}>
            <LineChart width={1000} height={500} data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
            </LineChart>
        </div>
    );
}

export default ChartLine;

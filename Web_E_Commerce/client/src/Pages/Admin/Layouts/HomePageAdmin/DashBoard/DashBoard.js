import classNames from 'classnames/bind';
import styles from './DashBoard.module.scss';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faChartSimple, faUser } from '@fortawesome/free-solid-svg-icons';

import request from '../../../../../config/Connect';

import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Đăng ký các thành phần Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const cx = classNames.bind(styles);

function Dashboard() {
    const [dataUser, setDataUser] = useState({});
    const [chartData, setChartData] = useState({
        labels: [], // Ngày
        datasets: [
            {
                label: 'Doanh thu (VNĐ)',
                data: [], // Doanh thu mỗi ngày
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4,
            },
        ],
    });
    const [lengthUser, setLengthUser] = useState(0);
    const [sumPirce, setSumPirce] = useState(0);

    useEffect(() => {
        // Lấy thông tin người dùng
        request.get('/api/auth/me').then((res) => setDataUser(res.data.dataUser));

        // Lấy dữ liệu thống kê 7 ngày từ API
        request.get('/api/test').then((res) => {
            const responseData = res.data.result; // Dữ liệu trả về từ API
            const labels = responseData.map((item) => item.date); // Mảng ngày
            const data = responseData.map((item) => item.totalRevenue); // Mảng doanh thu
            setLengthUser(res.data.lengthUser);
            const newSumPirce = data.reduce((total, item) => total + item, 0);
            setSumPirce(newSumPirce);
            // Cập nhật chartData
            setChartData((prev) => ({
                ...prev,
                labels: labels,
                datasets: [
                    {
                        ...prev.datasets[0],
                        data: data,
                    },
                ],
            }));
        });
    }, []);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Thống kê doanh thu 7 ngày trong tuần',
            },
        },
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('thong-ke')}>
                <div className={cx('chart-line')}>
                    <div className={cx('box-1')}>
                        <h4>Tổng Doanh Thu 7 Ngày Gần Đây</h4>
                        <FontAwesomeIcon icon={faChartSimple} />
                        <span>{sumPirce.toLocaleString()} VNĐ</span>
                    </div>
                    <div className={cx('box-3')}>
                        <h4>Tổng Người Dùng </h4>
                        <FontAwesomeIcon icon={faUser} />
                        <span>{lengthUser} Người Dùng </span>
                    </div>
                </div>
                <div className={cx('info-user')}>
                    <img src={`http://localhost:5000/avatars/${dataUser?.avatar}`} alt="Avatar" />
                    <div className={cx('info')}>
                        <h2>{dataUser?.fullname}</h2>
                        <span>0{dataUser?.phone}</span>
                        <span>{dataUser?.email}</span>
                        <span>Chức Vụ: {dataUser.isAdmin ? 'Admin' : 'Nhân Viên'}</span>
                    </div>
                </div>
            </div>

            <div className={cx('chart-line-2')}>
                <Line data={chartData} options={options} />
            </div>
        </div>
    );
}

export default Dashboard;

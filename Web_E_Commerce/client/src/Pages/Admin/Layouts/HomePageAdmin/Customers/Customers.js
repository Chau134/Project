import { useEffect, useState } from 'react';

import request from '../../../../../config/Connect';
import classNames from 'classnames/bind';
import styles from './Customers.module.scss';
import { ModalEditUser } from '../../../Modal/Modal';

const cx = classNames.bind(styles);

function Customers() {
    const [dataUser, setDataUser] = useState([]);
    const [show, setShow] = useState(false);
    const [email, setEmail] = useState('');

    useEffect(() => {
        request.get('/api/datauser').then((res) => setDataUser(res.data));
    }, [show]);

    const handleShowModal = (emailUser) => {
        setShow(!show);
        setEmail(emailUser);
    };

    return (
        <div className={cx('wrapper')}>
            <h1>Khách Hàng</h1>
            <table className={cx('table')}>
                <thead>
                    <tr>
                        <th style={{ color: '#fff' }} scope="col">
                            ID
                        </th>
                        <th style={{ color: '#fff' }} scope="col">
                            Full Name
                        </th>
                        <th style={{ color: '#fff' }} scope="col">
                            Email
                        </th>
                        <th style={{ color: '#fff' }} scope="col">
                            Chức vụ
                        </th>
                        <th style={{ color: '#fff' }} scope="col">
                            Hành Động
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {dataUser.map((item) => (
                        <>
                            <tr key={item._id}>
                                <th style={{ color: '#fff' }} scope="row">
                                    {item._id}
                                </th>
                                <td style={{ color: '#fff' }}>{item.fullname}</td>
                                <td style={{ color: '#fff' }}>{item.email}</td>
                                <td style={{ color: '#fff' }}>
                                    {item.isAdmin ? 'Admin' : item.isEmployee ? 'Nhân Viên' : 'Người Mua Hàng'}
                                </td>
                                <td style={{ color: '#fff' }}>
                                    <button
                                        onClick={() => handleShowModal(item.email)}
                                        type="button"
                                        className="btn btn-primary"
                                    >
                                        Chỉnh Sửa
                                    </button>
                                </td>
                            </tr>
                        </>
                    ))}
                </tbody>
            </table>
            <ModalEditUser show={show} setShow={setShow} email={email} />
        </div>
    );
}

export default Customers;

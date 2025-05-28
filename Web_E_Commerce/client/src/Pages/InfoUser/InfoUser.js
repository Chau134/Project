import classNames from 'classnames/bind';
import styles from './InfoUser.module.scss';

import Header from '../../Layouts/Header/Header';
import Footer from '../../Layouts/Footer/Footer';
import EditInfo, { ChangePassword } from './modal/Modal';
import request from '../../config/Connect';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ModalFeedBack from './modal/ModalFeedBack';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const cx = classNames.bind(styles);

function InfoUser() {
    const [dataUser, setDataUser] = useState();
    const [show, setShow] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [dataOrder, setDataOrder] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [data, setData] = useState([]);

    const [showModalEdit, setShowModalEdit] = useState(false);

    const token = document.cookie;

    const domain = 'http://localhost:5000/avatars/';

    const navigate = useNavigate();

    useEffect(() => {
        request.get('/api/dataorder').then((res) => setDataOrder(res.data));
    }, []);

    useEffect(() => {
        if (token) {
            request.get('api/auth').then((res) => setDataUser(res.data));
        } else {
            navigate('/login');
        }
    }, [navigate, token]);

    const handleShowModal = async () => {
        setShow(!show);
    };

    const handleLogout = () => {
        request.get('/api/logout');
        navigate('/');
        window.location.reload();
    };

    const handleModalEditInfo = () => {
        setShowModalEdit(!showModalEdit);
    };

    const handleChangeAvatar = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('avatar', selectedFile);
        try {
            await request.post('/api/avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            window.location.reload();
            console.log('Avatar uploaded successfully');
        } catch (error) {
            console.error('Error uploading avatar:', error);
        }
    };

    const showModalFeedBack = (data) => {
        setShowModal(!showModal);
        setData(data);
    };

    const handleDeleteOrder = async (id) => {
        const res = await request.post('/api/deleteorder', { id });
        toast.success(res.data.message);
        request.get('/api/dataorder').then((res) => setDataOrder(res.data));
    };

    return (
        <div className={cx('wrapper')}>
            <ToastContainer />
            <header>
                <Header />
            </header>

            <main className={cx('inner')}>
                <div className={cx('form-info-user')}>
                    <div className={cx('column-1')}>
                        <img src={domain + dataUser?.avatar} alt="..." />
                        <h3>{dataUser?.fullname}</h3>
                        <div className={cx('change-avatar')}>
                            <button onClick={handleChangeAvatar}>Thay Đổi Ảnh </button>
                        </div>
                        <button onClick={handleModalEditInfo}>Thay Đổi Thông Tin</button>
                        <button onClick={handleLogout}>Đăng Xuất</button>
                    </div>
                    <div className={cx('column-2')}>
                        <h2>Thông Tin Cá Nhân</h2>

                        <div className={cx('info-contact')}>
                            <div>
                                <h3>Email</h3>
                                <span>{dataUser?.email}</span>
                            </div>

                            <div>
                                <h3>Số Điện Thoại</h3>
                                <span>0{dataUser?.phone}</span>
                            </div>
                        </div>

                        <div className={cx('input-change')}>
                            <>
                                <input
                                    type="file"
                                    name="file"
                                    id="file"
                                    onChange={(e) => setSelectedFile(e.target.files[0])}
                                    className={cx('inputfile')}
                                />
                                <label htmlFor="file">Chọn Ảnh</label>
                            </>
                            <button id={cx('btn-change')} onClick={handleShowModal}>
                                Thay Đổi Mật Khẩu
                            </button>
                        </div>
                    </div>
                </div>
                <ChangePassword show={show} setShow={setShow} />
                <EditInfo showModalEdit={showModalEdit} setShowModalEdit={setShowModalEdit} />
            </main>

            <div className={cx('info-order')}>
                {dataOrder.map((item) => (
                    <table className="table table-bordered border-primary">
                        <thead>
                            <tr>
                                <th scope="col">Email Người Dùng</th>
                                <th scope="col">Tên Sản Phẩm</th>
                                <th scope="col">Tình Trạng Đặt Hàng</th>
                                <th scope="col">Trạng Thái</th>
                                <th scope="col">Tình Trạng</th>
                                {item.statusOrder ? <th scope="col">FeedBack</th> : <></>}
                                {item.statusOrder ? <></> : <th scope="col">Trạng Thái</th>}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{item.email}</td>
                                <td style={{ display: 'flex', flexDirection: 'column' }}>
                                    {item?.products.map((item2) => (
                                        <td>{item2.nameProduct}</td>
                                    ))}
                                </td>
                                <td>{item.order ? 'Đặt hàng không thành công' : 'Đặt hàng thành công'}</td>
                                <td>{item.statusOrder ? 'Đã giao hàng' : 'Đang vận chuyển'}</td>
                                <td>{item.statusPayment ? 'Đã thanh toán' : 'Chưa thanh toán'}</td>
                                {item.statusOrder ? (
                                    <td>
                                        <button
                                            onClick={() => showModalFeedBack(item)}
                                            type="button"
                                            className="btn btn-primary"
                                        >
                                            Đánh Giá
                                        </button>
                                    </td>
                                ) : (
                                    <></>
                                )}
                                {item.statusOrder ? (
                                    <></>
                                ) : (
                                    <td>
                                        <button
                                            onClick={() => handleDeleteOrder(item._id)}
                                            type="button"
                                            className="btn btn-danger"
                                        >
                                            Hủy Đơn
                                        </button>
                                    </td>
                                )}
                            </tr>
                        </tbody>
                    </table>
                ))}
            </div>
            <ModalFeedBack showModalFeedBack={showModal} setShowModalFeedBack={setShowModal} data={data} />

            <footer>
                <Footer />
            </footer>
        </div>
    );
}

export default InfoUser;

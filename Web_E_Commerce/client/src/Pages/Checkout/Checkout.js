import classNames from 'classnames/bind';
import styles from './Checkout.module.scss';

import Header from '../../Layouts/Header/Header';
import Footer from '../../Layouts/Footer/Footer';
import Banner from '../Layouts/Banner/Banner';
import request from '../../config/Connect';

import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loading from '../../Layouts/Loading/Loading';
import { Link, useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function Checkout() {
    const [dataCart, setDataCart] = useState({});
    const [checkBox, setCheckBox] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [firstName, setFirsName] = useState('');
    const [lastName, setLastName] = useState('');

    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [country, setCountry] = useState('');
    const [addressLine1, setAddressLine1] = useState('');

    const [city, setCity] = useState('');
    const [zip, setZip] = useState('');

    const navigate = useNavigate();

    const token = document.cookie;

    const dataAddress = { firstName, lastName, phoneNumber, email, country, addressLine1, city };

    useEffect(() => {
        if (token) {
            request.get('/api/getcart').then((res) => res.data.map((item) => setDataCart(item)));
        }
    }, [token]);

    const handlePaymentMomo = async () => {
        var pattern = /@/;
        const checkEmail = pattern.test(email);

        const phoneRegex = /^[0-9]{10}$/;
        const checkPhone = phoneRegex.test(phoneNumber);
        if (
            checkBox === false ||
            firstName === '' ||
            lastName === '' ||
            phoneNumber === '' ||
            email === '' ||
            country === '' ||
            addressLine1 === '' ||
            city === '' ||
            zip === ''
        ) {
            toast.error('Vui lòng chấp nhận các điều khoản của chúng tôi nếu không bạn đang thiếu thông tin');
        } else if (!checkEmail || !checkPhone) {
            // Kiểm tra xem email
            toast.error('Email Hoặc Số Điện Thoại Không Đúng Định Dạng !!!'); // Hàm toast.error hiển thị thông báo lỗi
        }  else if (!dataCart) {
            toast.error('Vui lòng quay lại trang mua hàng !!!');
        } else {
            try {
                setIsLoading(true);
                const res = await request.post('/api/paymentmomo', {
                    dataAddress,
                });
                if (res) {
                    setIsLoading(false);
                    toast.success(res.data.message);

                    window.open(res.data);
                    navigate('/thanks');
                }
            } catch (error) {
                toast.error(error.response.data.message);
            }
        }
    };

    const handlePayment = async () => {
        var pattern = /@/;
        const checkEmail = pattern.test(email);

        const phoneRegex = /^[0-9]{10}$/;
        const checkPhone = phoneRegex.test(phoneNumber);
        if (
            checkBox === false ||
            firstName === '' ||
            lastName === '' ||
            phoneNumber === '' ||
            email === '' ||
            country === '' ||
            addressLine1 === '' ||
            city === '' ||
            zip === ''
        ) {
            toast.error('Vui lòng chấp nhận các điều khoản của chúng tôi nếu không bạn đang thiếu thông tin');
        }else if (!checkEmail || !checkPhone) {
            // Kiểm tra xem email
            toast.error('Email Hoặc Số Điện Thoại Không Đúng Định Dạng !!!'); // Hàm toast.error hiển thị thông báo lỗi
        }  else if (!dataCart) {
            toast.error('Vui lòng quay lại trang mua hàng !!!');
        } else {
            request.post('/api/payment').then((res) => console.log(res.data));
            navigate('/thanks');
        }
    };

    return (
        <div className={cx('wrapper')}>
            <ToastContainer />
            <header>
                <Header />
            </header>

            <Loading isLoading={isLoading} />

            <div>
                <Banner />
            </div>

            <main className={cx('inner')}>
                <div className={cx('inner-checkout')}>
                    <div className={cx('column-billing')}>
                        <h1 id={cx('title-billing')}>Thông Tin Thanh Toán</h1>
                        <div className={cx('input-name')}>
                            <div className="input-group mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nhập tên của bạn"
                                    onChange={(e) => setFirsName(e.target.value)}
                                />
                            </div>

                            <div className="input-group mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Nhập họ của bạn"
                                    onChange={(e) => setLastName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className={cx('input-name')}>
                            <div className="input-group mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Số điện thoại"
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                />
                            </div>

                            <div className="input-group mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Email của bạn"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Tỉnh/Thành phố"
                            onChange={(e) => setCountry(e.target.value)}
                        />
                        <div></div>
                        <div className="mt-5">
                            <div className="input-group mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Địa chỉ nhận hàng"
                                    onChange={(e) => setAddressLine1(e.target.value)}
                                />
                            </div>

                            <div className="input-group mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Quận/Huyện"
                                    onChange={(e) => setCity(e.target.value)}
                                />
                            </div>

                            <div className="input-group mb-3 mt-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Xã/Phường/Thị trấn"
                                    onChange={(e) => setZip(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={cx('form-order')}>
                        <div className={cx('inner-order')}>
                            <h1 id={cx('title-order')}>Sản Phẩm Thanh Toán</h1>

                            <div>
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th scope="col">Tên Sản Phẩm</th>
                                            <th scope="col">Số Lượng</th>
                                            <th scope="col">Tổng</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dataCart?.products?.map((item) => (
                                            <tr key={item?._id}>
                                                <td>{item?.nameProduct}</td>
                                                <td>x {item?.quantity}</td>
                                                <td>$ {item.price?.toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>

                                    <tbody>
                                        <tr>
                                            <td>Tạm Tính</td>
                                            <td></td>
                                            <td>$ {dataCart?.sumPrice?.toLocaleString()}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className={cx('form-pay')}>
                                <div className={cx('checkbox-terms')}>
                                    <input onChange={(e) => setCheckBox(e.target.checked)} type="checkbox" />
                                    <label>Vui lòng chấp nhận điều khoản của chúng tôi</label>
                                </div>

                                <div className={cx('payment-momo')}>
                                    <button onClick={handlePaymentMomo}>
                                        <img
                                            src={
                                                'https://cdn.haitrieu.com/wp-content/uploads/2022/10/Icon-VNPAY-QR.png'
                                            }
                                            alt=""
                                        />
                                        <span>Thanh Toán Qua VNPAY</span>
                                    </button>
                                </div>

                                <div className={cx('continue')}>
                                    <button onClick={handlePayment}>
                                        <Link style={{ textDecoration: 'none', color: 'white' }}>
                                            <span>Thanh Toán Khi Nhận Hàng</span>
                                        </Link>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer>
                <Footer />
            </footer>
        </div>
    );
}

export default Checkout;

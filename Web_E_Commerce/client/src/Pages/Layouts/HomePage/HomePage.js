import classNames from 'classnames/bind';
import styles from './HomePage.module.scss';

import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { addProduct } from '../../../redux/actions';
import { useDispatch } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const cx = classNames.bind(styles);

function HomePage({ dataProducts, checkPrice, checkType2, checkType3 }) {
    const dispatch = useDispatch();

    const handleAddProduct = (data) => {
        dispatch(addProduct(data));
        toast.success('Thêm Vào Giỏ Hàng Thành Công !!!');
    };

    return (
        <div className={cx('wrapper')}>
            <ToastContainer />
            <div className={cx('inner')}>
                {dataProducts
                    .filter((item) => checkType2 === '' || item.checkType === checkType2)
                    .filter((item) => checkType3 === '' || item.checkType === checkType3)
                    .sort(checkPrice === '1' ? (a, b) => b.priceNew - a.priceNew : (a, b) => a.priceNew - b.priceNew)
                    .map((item) => (
                        <div key={item.id} className={cx('form-slide-products')}>
                            <div className={cx('social-icon')}>
                                <button onClick={() => handleAddProduct(item)}>
                                    <FontAwesomeIcon icon={faCartPlus} />
                                </button>
                            </div>
                            <Link style={{ textDecoration: 'none' }} key={item.id} to={`/prodetail/${item.id}`}>
                                <img src={`http://localhost:5000/${item.img}`} alt="" />
                            </Link>
                            <div className={cx('main-slide-products')}>
                                <h1>{item.nameProducts}</h1>
                                <div className={cx('price-slide-products')}>
                                    <span id={cx('price-new')}>{item.priceNew.toLocaleString()} VNĐ</span>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default HomePage;

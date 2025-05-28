import classNames from 'classnames/bind';
import styles from './SlideBar.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBlog, faCartPlus, faChartLine, faFile, faHome, faUser } from '@fortawesome/free-solid-svg-icons';
import { jwtDecode } from 'jwt-decode';
import { useState } from 'react';
const cx = classNames.bind(styles);

function SlideBar({ setActiveList }) {
    const [checkType, setCheckType] = useState(0);

    const handleActiveList = (data, type) => {
        setCheckType(type);
        setActiveList(data);
    };

    const token = document.cookie;
    const checkUser = jwtDecode(token);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('controller')}>
                <ul>
                    <li id={cx(checkType === 0 ? 'active' : '')} onClick={() => handleActiveList('dash', 0)}>
                        <FontAwesomeIcon id={cx('icons')} icon={faHome} />
                        <h5>Trang Chủ</h5>
                    </li>
                    {checkUser.admin || checkUser.employee ? (
                        <li id={cx(checkType === 1 ? 'active' : '')} onClick={() => handleActiveList('order', 1)}>
                            <FontAwesomeIcon id={cx('icons')} icon={faFile} />
                            <h5> Đơn Hàng</h5>
                        </li>
                    ) : null}
                    {checkUser.admin ? (
                        <>
                            <li id={cx(checkType === 2 ? 'active' : '')} onClick={() => handleActiveList('product', 2)}>
                                <FontAwesomeIcon id={cx('icons')} icon={faCartPlus} />
                                <h5> Sản Phẩm</h5>
                            </li>

                            <li
                                id={cx(checkType === 3 ? 'active' : '')}
                                onClick={() => handleActiveList('customer', 3)}
                            >
                                <FontAwesomeIcon id={cx('icons')} icon={faUser} />
                                <h5> Người Dùng</h5>
                            </li>
                        </>
                    ) : (
                        <></>
                    )}

                    {checkUser.admin || checkUser.employee ? (
                        <li id={cx(checkType === 5 ? 'active' : '')} onClick={() => handleActiveList('blog', 5)}>
                            <FontAwesomeIcon id={cx('icons')} icon={faBlog} />
                            <h5> Bài Viết</h5>
                        </li>
                    ) : null}
                </ul>
            </div>
        </div>
    );
}

export default SlideBar;

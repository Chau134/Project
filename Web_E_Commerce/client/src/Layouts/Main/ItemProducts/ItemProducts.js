import classNames from 'classnames/bind';
import styles from './ItemProducts.module.scss';

import img1 from './img/items1.jpg';
import img2 from './img/items2.jpg';
import img3 from './img/items3.jpg';
import img4 from './img/items4.jpeg';
const cx = classNames.bind(styles);

function ItemProducts() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('row-product')}>
                <img id={cx('img-item')} src={img1} alt="" />
                <span>Son</span>
            </div>

            <div className={cx('row-product')}>
                <img id={cx('img-item')} src={img2} alt="" />
                <span>Giày</span>
            </div>

            <div className={cx('row-product')}>
                <img id={cx('img-item')} src={img3} alt="" />
                <span>Nến Thơm</span>
            </div>
            <div className={cx('row-product')}>
                <img id={cx('img-item')} src={img4} alt="" />
                <span>Nước Hoa</span>
            </div>
        </div>
    );
}

export default ItemProducts;

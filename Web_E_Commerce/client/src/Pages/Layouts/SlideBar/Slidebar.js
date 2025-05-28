import classNames from 'classnames/bind';
import styles from './Slidebar.module.scss';

const cx = classNames.bind(styles);

function SlideBar({ setValueType, setCheckPrice, valueType, setCheckType2, setCheckType3 }) {
    const handleOnchange = (e) => {
        setValueType(e);
        if (e === 'nuocHoa' || e === 'nenThom' || e === 'giay' || e === 'son') {
            setCheckType2('');
            setCheckType3('');
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('select-option')}>
                <div>
                    <select
                        className="form-select"
                        aria-label="Default select example"
                        onChange={(e) => handleOnchange(e.target.value)}
                    >
                        <>
                            <option value="" selected>
                                Lọc Sản Phẩm
                            </option>
                            <option value="nuocHoa">Nước Hoa</option>
                            <option value="nenThom">Nến Thơm</option>
                            <option value="son">Son</option>
                            <option value="fashionMen">Thời Trang Nam</option>
                            <option value="fashionWomen">Thời Trang Nữ</option>
                        </>
                    </select>
                </div>
            </div>
            {valueType === 'fashionMen' ? (
                <div className={cx('select-option')}>
                    <div>
                        <select
                            className="form-select"
                            aria-label="Default select example"
                            onChange={(e) => setCheckType2(e.target.value)}
                        >
                            <>
                                <option value="" selected>
                                    Phân Loại
                                </option>
                                <option value="trousers">Áo Nam</option>
                                <option value="shirt">Quần Nam</option>
                                <option value="giay">Giày Nam</option>
                            </>
                        </select>
                    </div>
                </div>
            ) : (
                <></>
            )}

            {valueType === 'fashionWomen' ? (
                <div className={cx('select-option')}>
                    <div>
                        <select
                            className="form-select"
                            aria-label="Default select example"
                            onChange={(e) => setCheckType3(e.target.value)}
                        >
                            <>
                                <option value="" selected>
                                    Phân Loại
                                </option>
                                <option value="trousers">Áo Nữ</option>
                                <option value="shirt">Quần Nữ</option>
                                <option value="dress">Váy Nữ</option>
                                <option value="giay">Giày Nữ</option>
                            </>
                        </select>
                    </div>
                </div>
            ) : (
                <></>
            )}

            <div className={cx('select-option')}>
                <div>
                    <select
                        className="form-select"
                        aria-label="Default select example"
                        onChange={(e) => setCheckPrice(e.target.value)}
                    >
                        <>
                            <option value="" selected>
                                Lọc Theo Giá
                            </option>
                            <option value="1">Giá từ cao đến thấp</option>
                            <option value="2">Giá từ thấp đến cao</option>
                        </>
                    </select>
                </div>
            </div>
        </div>
    );
}

export default SlideBar;

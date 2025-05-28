import classNames from 'classnames/bind';
import styles from './Products.module.scss';
import { ModalAddProduct, ModalDeleteProduct, ModalEditProduct } from '../../../Modal/Modal';

const cx = classNames.bind(styles);

function Products({
    dataProducts,
    show,
    setShow,
    handleShowModalAddProduct,
    showModalDelete,
    setShowModalDelete,
    handleShowModalDeleteProduct,
    idProduct,
    handleShowModalEditProduct,
    showModalEdit,
    setShowModalEdit,
    setValueType,
    valueType,
}) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('header-product')}>
                <h1>Sản Phẩm</h1>
                <button onClick={handleShowModalAddProduct} type="button" className="btn btn-primary">
                    Thêm Sản Phẩm
                </button>
            </div>
            <div>
                <select
                    className="form-select"
                    aria-label="Default select example"
                    onChange={(e) => setValueType(e.target.value)}
                >
                    <>
                        <option value="" selected>
                            Lọc Sản Phẩm
                        </option>
                        <option value="nuocHoa">Nước Hoa</option>
                        <option value="nenThom">Nến Thơm</option>
                        <option value="giay">Giày</option>
                        <option value="son">Son</option>
                        <option value="fashionMen">Thời Trang Nam</option>
                        <option value="fashionWomen">Thời Trang Nữ</option>
                    </>
                </select>
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th style={{ color: '#fff' }} scope="col">
                            ID
                        </th>
                        <th style={{ color: '#fff' }} scope="col">
                            Tên Sản Phẩm
                        </th>
                        <th style={{ color: '#fff' }} scope="col">
                            Ảnh Sản Phẩm
                        </th>
                        <th style={{ color: '#fff' }} scope="col">
                            Giá
                        </th>
                        <th style={{ color: '#fff' }} scope="col">
                            Hành Động
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {dataProducts
                        .filter((item) => valueType === '' || item.checkProducts === valueType)
                        .map((item) => (
                            <>
                                <tr key={item._id}>
                                    <th style={{ color: '#fff' }} scope="row">
                                        {item.id}
                                    </th>
                                    <td style={{ color: '#fff' }}>{item.nameProducts}</td>
                                    <td style={{ color: '#fff' }}>
                                        <img
                                            style={{ width: '120px' }}
                                            src={`http://localhost:5000/${item.img}`}
                                            alt="."
                                        />
                                    </td>
                                    <td style={{ color: '#fff' }}>$ {item.priceNew.toLocaleString()}</td>
                                    <td style={{ color: '#fff' }}>
                                        <button
                                            onClick={() => handleShowModalEditProduct(item.id)}
                                            type="button"
                                            className="btn btn-warning"
                                        >
                                            Sửa Sản Phẩm
                                        </button>
                                        <button
                                            onClick={() => handleShowModalDeleteProduct(item.id)}
                                            type="button"
                                            className="btn btn-danger"
                                            style={{ marginLeft: '10px' }}
                                        >
                                            Xóa Sản Phẩm
                                        </button>
                                    </td>
                                </tr>
                            </>
                        ))}
                </tbody>
            </table>
            <ModalAddProduct show={show} setShow={setShow} />
            <ModalDeleteProduct
                showModalDelete={showModalDelete}
                setShowModalDelete={setShowModalDelete}
                idProduct={idProduct}
            />
            <ModalEditProduct showModalEdit={showModalEdit} setShowModalEdit={setShowModalEdit} idProduct={idProduct} />
        </div>
    );
}

export default Products;

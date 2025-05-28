import classNames from 'classnames/bind';
import styles from './Modal.module.scss';

import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import request from '../../../config/Connect';
import { toast, ToastContainer } from 'react-toastify';

const cx = classNames.bind(styles);

export function ModalAddProduct({ show, setShow }) {
    const handleClose = () => setShow(false);

    const [nameProduct, setNameProduct] = useState('');
    const [priceProduct, setPriceProduct] = useState(0);
    const [desProduct, setDesProduct] = useState('');
    const [fileImg, setFileImg] = useState('');
    const [selectedCheckbox, setSelectedCheckbox] = useState('');

    const [checkOption, setCheckOption] = useState('0');
    const [checkType, setCheckType] = useState('');
    const [quantityPro, setQuantityPro] = useState(0);

    const handleCheckboxChange = (checkboxName) => {
        if (selectedCheckbox === checkboxName) {
            setSelectedCheckbox('');
        } else {
            setSelectedCheckbox(checkboxName);
        }
    };

    const handleAddProduct = async () => {
        const formData = new FormData();
        formData.append('imgpro', fileImg);

        const checkProduct = selectedCheckbox || (checkOption === '1' ? 'fashionMen' : 'fashionWomen');

        try {
            if (!nameProduct || !priceProduct || !desProduct || quantityPro === 0 || !fileImg) {
                toast.error('Vui lòng điền đầy đủ thông tin !!!');
                return;
            }

            formData.append('nameProduct', nameProduct);
            formData.append('priceProduct', priceProduct);
            formData.append('desProduct', desProduct);
            formData.append('checkProduct', checkProduct);
            formData.append('checkType', checkType);
            formData.append('quantityPro', quantityPro);

            const res = await request.post('/api/addproduct', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success(res.data.message);
            await request.get('/api/products');
        } catch (error) {
            toast.error('Có lỗi xảy ra!');
        }
    };

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <ToastContainer />
                <Modal.Header closeButton>
                    <Modal.Title>Thêm Sản Phẩm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="basic-addon1">
                            Tên Sản Phẩm
                        </span>
                        <input type="text" className="form-control" onChange={(e) => setNameProduct(e.target.value)} />
                    </div>

                    <div>
                        <div className="mb-3">
                            <label htmlFor="formFile" className="form-label">
                                Chọn Ảnh Sản Phẩm
                            </label>
                            <input
                                className="form-control"
                                type="file"
                                id="formFile"
                                onChange={(e) => setFileImg(e.target.files[0])}
                            />
                        </div>
                    </div>

                    <div className="input-group mb-3">
                        <span className="input-group-text" id="basic-addon1">
                            Giá Sản Phẩm
                        </span>
                        <input
                            type="number"
                            className="form-control"
                            onChange={(e) => setPriceProduct(parseFloat(e.target.value))}
                        />
                    </div>

                    <div className="input-group mb-3">
                        <div className="form-floating">
                            <textarea
                                className="form-control"
                                placeholder="Leave a comment here"
                                id="floatingTextarea2"
                                style={{ height: '150px' }}
                                onChange={(e) => setDesProduct(e.target.value)}
                            ></textarea>
                            <label htmlFor="floatingTextarea2">Mô Tả Sản Phẩm</label>
                        </div>
                    </div>

                    <div className={cx('option')}>
                        <div className={cx('form-checkbox')}>
                            <label>Nước Hoa</label>
                            <input
                                type="checkbox"
                                checked={selectedCheckbox === 'nuocHoa'}
                                onChange={() => handleCheckboxChange('nuocHoa')}
                            />
                        </div>

                        <div className={cx('form-checkbox')}>
                            <label>Nến Thơm</label>
                            <input
                                type="checkbox"
                                onChange={() => handleCheckboxChange('nenThom')}
                                checked={selectedCheckbox === 'nenThom'}
                            />
                        </div>

                        <div className={cx('form-checkbox')}>
                            <label>Son</label>
                            <input
                                type="checkbox"
                                checked={selectedCheckbox === 'son'}
                                onChange={() => handleCheckboxChange('son')}
                            />
                        </div>
                    </div>

                    {selectedCheckbox === '' && (
                        <div>
                            <select
                                onChange={(e) => setCheckOption(e.target.value)}
                                className="form-select mt-3"
                                aria-label="Default select example"
                            >
                                <option value="0">Thời Trang</option>
                                <option value="1">Thời Trang Nam</option>
                                <option value="2">Thời Trang Nữ</option>
                            </select>
                        </div>
                    )}

                    {checkOption === '1' && (
                        <div>
                            <select
                                onChange={(e) => setCheckType(e.target.value)}
                                className="form-select mt-3"
                                aria-label="Default select example"
                            >
                                <option value="">Loại</option>
                                <option value="trousers">Áo</option>
                                <option value="shirt">Quần</option>
                                <option value="giay">Giày Nam</option>
                            </select>
                        </div>
                    )}

                    {checkOption === '2' && (
                        <div>
                            <select
                                onChange={(e) => setCheckType(e.target.value)}
                                className="form-select mt-3"
                                aria-label="Default select example"
                            >
                                <option value="">Loại</option>
                                <option value="trousers">Áo</option>
                                <option value="shirt">Quần</option>
                                <option value="dress">Váy</option>
                                <option value="giay">Giày Nữ</option>
                            </select>
                        </div>
                    )}

                    <div>
                        <div className="form-floating mt-3">
                            <input
                                onChange={(e) => setQuantityPro(parseInt(e.target.value))}
                                type="number"
                                className="form-control"
                                id="floatingInput"
                            />
                            <label htmlFor="floatingInput">Số Lượng Sản Phẩm</label>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleAddProduct}>
                        Thêm Sản Phẩm
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export function ModalDeleteProduct({ showModalDelete, setShowModalDelete, idProduct }) {
    const handleClose = () => setShowModalDelete(false);

    const handleDeleteProduct = async () => {
        try {
            const res = await request.post('/api/deleteproduct', { id: idProduct });
            toast.success(res.data.message);
        } catch (error) {}
    };

    return (
        <div>
            <Modal show={showModalDelete} onHide={handleClose}>
                <ToastContainer />
                <Modal.Header closeButton>
                    <Modal.Title>Xóa Sản Phẩm</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn Muốn Xóa Sản Phẩm Có ID : {idProduct}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleDeleteProduct}>
                        Xóa
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export function ModalEditProduct({ setShowModalEdit, showModalEdit, idProduct }) {
    const handleClose = () => setShowModalEdit(false);
    const [nameProduct, setNameProduct] = useState('');
    const [imgProduct, setImgProduct] = useState(null);
    const [priceProduct, setPriceProduct] = useState(0);
    const [desProduct, setDesProduct] = useState('');
    const [valueProduct, setValueProduct] = useState('');
    const [selectedCheckbox, setSelectedCheckbox] = useState('');
    const [checkOption, setCheckOption] = useState('0');
    const [checkType, setCheckType] = useState('');
    const [quantityPro, setQuantityPro] = useState(0);

    useEffect(() => {
        if (showModalEdit) {
            const fetchData = async () => {
                try {
                    const res = await request.get(`/api/getproduct`, { params: { id: idProduct } });
                    const data = res.data;
                    setNameProduct(data.nameProducts);
                    setPriceProduct(data.priceNew);
                    setDesProduct(data.des);
                    setValueProduct(data.quantityPro);
                    setSelectedCheckbox(data.checkProducts);
                    setCheckOption(data.checkOption);
                    setCheckType(data.checkType);
                    setQuantityPro(data.quantityPro);
                } catch (error) {
                    toast.error('Lỗi khi tải dữ liệu sản phẩm');
                }
            };
            fetchData();
        }
    }, [showModalEdit, idProduct]);

    const handleCheckboxChange = (checkboxName) => {
        if (selectedCheckbox === checkboxName) {
            setSelectedCheckbox('');
        } else {
            setSelectedCheckbox(checkboxName);
        }
    };

    const handleEditProduct = async () => {
        const checkProduct = selectedCheckbox || (checkOption === '1' ? 'fashionMen' : 'fashionWomen');
        const formData = new FormData();
        formData.append('nameProduct', nameProduct);
        formData.append('imgpro', imgProduct);
        formData.append('priceProduct', priceProduct);
        formData.append('desProduct', desProduct);
        formData.append('valueProduct', valueProduct);
        formData.append('id', idProduct);
        formData.append('checkProduct', checkProduct);
        formData.append('checkType', checkType);
        formData.append('quantityPro', quantityPro);

        try {
            const res = await request.post('/api/editproduct', formData);
            toast.success(res.data.message);
        } catch (error) {
            toast.error('Lỗi khi chỉnh sửa sản phẩm');
        }
    };

    return (
        <div>
            <Modal show={showModalEdit} onHide={handleClose}>
                <ToastContainer />
                <Modal.Header closeButton>
                    <Modal.Title>Sửa Sản Phẩm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <label className="mb-3">Nhập Các Thông Tin Cần Sửa</label>
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="basic-addon1">
                            Tên Sản Phẩm
                        </span>
                        <input
                            type="text"
                            className="form-control"
                            value={nameProduct}
                            onChange={(e) => setNameProduct(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Chọn Ảnh Sản Phẩm</label>
                        <input
                            className="form-control"
                            type="file"
                            onChange={(e) => setImgProduct(e.target.files[0])}
                        />
                    </div>
                    <div className="input-group mb-3">
                        <span className="input-group-text" id="basic-addon1">
                            Giá Sản Phẩm
                        </span>
                        <input
                            type="number"
                            className="form-control"
                            value={priceProduct}
                            onChange={(e) => setPriceProduct(e.target.value)}
                        />
                    </div>
                    <div className="input-group mb-3">
                        <div className="form-floating">
                            <textarea
                                className="form-control"
                                placeholder="Leave a comment here"
                                style={{ height: '150px' }}
                                value={desProduct}
                                onChange={(e) => setDesProduct(e.target.value)}
                            ></textarea>
                            <label>Mô Tả Sản Phẩm</label>
                        </div>
                    </div>
                    <div className={cx('option')}>
                        <div className={cx('form-checkbox')}>
                            <label>Nước Hoa</label>
                            <input
                                type="checkbox"
                                checked={selectedCheckbox === 'nuocHoa'}
                                onChange={() => handleCheckboxChange('nuocHoa')}
                            />
                        </div>
                        <div className={cx('form-checkbox')}>
                            <label>Nến Thơm</label>
                            <input
                                type="checkbox"
                                checked={selectedCheckbox === 'nenThom'}
                                onChange={() => handleCheckboxChange('nenThom')}
                            />
                        </div>
                        <div className={cx('form-checkbox')}>
                            <label>Son</label>
                            <input
                                type="checkbox"
                                checked={selectedCheckbox === 'son'}
                                onChange={() => handleCheckboxChange('son')}
                            />
                        </div>
                    </div>
                    <div>
                        <select
                            value={checkOption}
                            onChange={(e) => setCheckOption(e.target.value)}
                            className="form-select mt-3"
                            aria-label="Default select example"
                        >
                            <option value="0">Thời Trang</option>
                            <option value="1">Thời Trang Nam</option>
                            <option value="2">Thời Trang Nữ</option>
                        </select>
                    </div>
                    {checkOption === '1' && (
                        <div>
                            <select
                                value={checkType}
                                onChange={(e) => setCheckType(e.target.value)}
                                className="form-select mt-3"
                                aria-label="Default select example"
                            >
                                <option value="">Loại</option>
                                <option value="trousers">Áo</option>
                                <option value="shirt">Quần</option>
                                <option value="giay">Giày Nam</option>
                            </select>
                        </div>
                    )}
                    {checkOption === '2' && (
                        <div>
                            <select
                                value={checkType}
                                onChange={(e) => setCheckType(e.target.value)}
                                className="form-select mt-3"
                                aria-label="Default select example"
                            >
                                <option value="">Loại</option>
                                <option value="trousers">Áo</option>
                                <option value="shirt">Quần</option>
                                <option value="dress">Váy</option>
                                <option value="giay">Giày Nữ</option>
                            </select>
                        </div>
                    )}
                    <div className="form-floating mt-3">
                        <input
                            type="number"
                            className="form-control"
                            value={quantityPro}
                            onChange={(e) => setQuantityPro(e.target.value)}
                        />
                        <label>Số Lượng Sản Phẩm</label>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleEditProduct}>
                        Lưu Lại
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export function ModalAddBlog({ show, setShow }) {
    const handleClose = () => setShow(false);

    const [img, setImg] = useState('');
    const [title, setTitle] = useState('');
    const [des, setDes] = useState('');

    const formData = new FormData();
    formData.append('img', img);
    formData.append('title', title);
    formData.append('des', des);

    const handleAddBlog = async () => {
        try {
            const res = await request.post('/api/addblog', formData);
            toast.success(res.data.message);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <ToastContainer />
                <Modal.Header closeButton>
                    <Modal.Title>Thêm Bài Viết</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <div class="mb-3">
                            <label for="formFile" class="form-label">
                                Chọn Ảnh Bài Viết
                            </label>
                            <input
                                class="form-control"
                                type="file"
                                id="formFile"
                                onChange={(e) => setImg(e.target.files[0])}
                            />
                        </div>
                    </div>

                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Name Blog"
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Description"
                            onChange={(e) => setDes(e.target.value)}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleAddBlog}>
                        Thêm Bài Viết
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export function CheckProduct({ show, setShow, idProduct }) {
    const handleClose = () => setShow(false);

    const handleCheckProduct = async () => {
        try {
            const res = await request.post('/api/checkproduct', { idProduct });
            toast.success(res.data.message);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <Modal show={show} onHide={handleClose}>
                <ToastContainer />
                <Modal.Header closeButton>
                    <Modal.Title>Duyệt Đơn Hàng </Modal.Title>
                </Modal.Header>
                <Modal.Body>Duyệt Đơn Hàng Cho : {idProduct}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleCheckProduct}>
                        Duyệt
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export function ModalEditOrder({ show, setShow, id }) {
    const handleClose = () => setShow(false);

    const [valueTest, setValueTest] = useState('0');
    const [valueTest1, setValueTest1] = useState('0');

    const handleEditOrder = () => {
        request.post('/api/editorder', { valueTest, id, valueTest1 }).then((res) => {
            toast.success(res.data.message);
        });
    };

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Chỉnh Sửa Đặt Đơn </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <select
                        onChange={(e) => setValueTest(e.target.value)}
                        className="form-select mb-3"
                        aria-label="Default select example"
                    >
                        <option selected>Trạng Thái Đơn Hàng</option>
                        <option value="1">Đang Vận Chuyển</option>
                        <option value="2">Đã Giao Hàng</option>
                    </select>

                    <select
                        onChange={(e) => setValueTest1(e.target.value)}
                        className="form-select"
                        aria-label="Default select example"
                    >
                        <option selected>Trạng Thái Thanh Toán</option>
                        <option value="1">Chưa Thanh Toán</option>
                        <option value="2">Đã Thanh Toán</option>
                    </select>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleEditOrder}>
                        Lưu lại
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export function ModalEditUser({ show, setShow, email }) {
    const [valueSelect, setValueSelect] = useState('0');

    const handleEditUser = async () => {
        try {
            const res = await request.post('/api/edituser', { valueSelect, email });
            toast.success(res.data.message);
        } catch (error) {
            console.log(error);
        }
    };

    const handleClose = () => setShow(false);

    return (
        <Modal show={show} onHide={handleClose}>
            <ToastContainer />
            <Modal.Header closeButton>
                <Modal.Title>Chỉnh Sửa Quyền </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <select
                    onChange={(e) => setValueSelect(e.target.value)}
                    className="form-select"
                    aria-label="Default select example"
                >
                    <option selected>Chọn quyền</option>
                    <option value="1">Người Dùng</option>
                    <option value="2">Nhân Viên</option>
                    <option value="3">Người Quản Trị</option>
                </select>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Đóng
                </Button>
                <Button variant="primary" onClick={handleEditUser}>
                    Lưu Lại
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export function EditBlog({ show, setShow, id }) {
    const handleClose = () => setShow(false);

    const [imgBlog, setImgBlog] = useState('');
    const [titleBlog, setTitleBlog] = useState('');
    const [desBlog, setDesBlog] = useState('');

    const formData = new FormData();
    formData.append('imgBlog', imgBlog);
    formData.append('titleBlog', titleBlog);
    formData.append('desBlog', desBlog);
    formData.append('id', id);

    const handleEditBlog = () => {
        request.post('/api/editblog', formData, id).then((res) => {
            toast.success(res.data.message);
        });
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <ToastContainer/>
            <Modal.Header closeButton>
                <Modal.Title>Chỉnh Sửa Bài Viết</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <div class="mb-3">
                        <label for="formFile" class="form-label">
                            Chọn Ảnh Bài Viết
                        </label>
                        <input
                            class="form-control"
                            type="file"
                            id="formFile"
                            onChange={(e) => setImgBlog(e.target.files[0])}
                        />
                    </div>
                </div>
                <div class="form-floating mb-3">
                    <input
                        type="text"
                        class="form-control"
                        id="floatingPassword"
                        placeholder="Password"
                        onChange={(e) => setTitleBlog(e.target.value)}
                    />
                    <label for="floatingPassword">Tên Bài Viết</label>
                </div>
                <div class="form-floating">
                    <input
                        type="text"
                        class="form-control"
                        id="floatingPassword"
                        placeholder="Password"
                        onChange={(e) => setDesBlog(e.target.value)}
                    />
                    <label for="floatingPassword">Mô Tả Bài Viết</label>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Đóng
                </Button>
                <Button variant="primary" onClick={handleEditBlog}>
                    Lưu Lại
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

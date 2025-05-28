import { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Link, useNavigate } from 'react-router-dom';
import request from '../../../config/Connect';

function ModalFeedBack({ showModalFeedBack, setShowModalFeedBack, data }) {
    const handleClose = () => setShowModalFeedBack(false);
    const navigate = useNavigate();

    const dataNew = data.products;

    const handleFeedBack = async (debounce) => {
        const res = await request.get('/api/search', { params: { nameProduct: debounce } });
        res.data.map((item) => navigate(`/prodetail/${item?.id}`));
    };

    return (
        <>
            <Modal show={showModalFeedBack} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Đánh Giá Sản Phẩm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <table class="table table-bordered border-primary">
                        <thead>
                            <tr>
                                <th scope="col">Tên Sản Phẩm</th>
                                <th scope="col">Đánh Giá</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataNew?.map((item) => (
                                <tr key={item?._id}>
                                    <th scope="row">{item?.nameProduct}</th>
                                    <td>
                                        <button type="button" className="btn btn-primary">
                                            <Link
                                                onClick={() => handleFeedBack(item?.nameProduct)}
                                                style={{ color: '#fff', textDecoration: 'none' }}
                                            >
                                                Đánh Giá
                                            </Link>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ModalFeedBack;

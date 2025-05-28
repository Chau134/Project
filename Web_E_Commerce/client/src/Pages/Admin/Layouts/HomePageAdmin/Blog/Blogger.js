import { toast, ToastContainer } from 'react-toastify';
import request from '../../../../../config/Connect';
import { EditBlog, ModalAddBlog } from '../../../Modal/Modal';
import { useEffect, useState } from 'react';

import classNames from 'classnames/bind';
import styles from './Blog.module.scss';
const cx = classNames.bind(styles);

function Blogger() {
    const [show, setShow] = useState(false);
    const [dataBlog, setDataBlog] = useState([]);
    const [show1, setShow1] = useState(false);
    const [idBlog, setIdBlog] = useState(0);

    const handleShow = () => {
        setShow(!show);
    };

    const handleShow1 = (id) => {
        setShow1(!show1);
        setIdBlog(id);
    };
    useEffect(() => {
        request.get('/api/getblog').then((res) => setDataBlog(res.data));
    }, [show, show1]);

    const handleDeleteBlog = async (data) => {
        const res = await request.post('/api/deleteblog', { id: data });
        await request.get('/api/getblog').then((res) => setDataBlog(res.data));
        toast.success(res.data.message);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('btn-addBlog')}>
                <h1>Bài Viết</h1>
                <button onClick={handleShow} type="button" className="btn btn-primary">
                    Thêm Bài Viết
                </button>
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th style={{ color: '#fff' }} scope="col">
                            ID
                        </th>
                        <th style={{ color: '#fff' }} scope="col">
                            Ảnh Bài Viết
                        </th>
                        <th style={{ color: '#fff' }} scope="col">
                            Tên Bài Viết
                        </th>
                        <th style={{ color: '#fff' }} scope="col">
                            Mô Tả Bài Viết
                        </th>
                        <th style={{ color: '#fff' }} scope="col">
                            Hành Động
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {dataBlog.map((item) => (
                        <tr key={item.id}>
                            <th style={{ color: '#fff' }} scope="row">
                                1
                            </th>
                            <td>
                                <img style={{ width: '150px' }} src={`http://localhost:5000/blog/${item.img}`} alt="" />
                            </td>
                            <td style={{ color: '#fff' }}>{item.title}</td>
                            <td style={{ color: '#fff' }}>{item.des}</td>
                            <td style={{ color: '#fff' }}>
                                <button
                                    onClick={() => handleDeleteBlog(item.id)}
                                    type="button"
                                    className="btn btn-danger"
                                >
                                    Xóa Bài Viết
                                </button>
                                <button type="button" onClick={() => handleShow1(item._id)} className="btn btn-warning">
                                    Sửa Bài Viết
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ToastContainer />
            <ModalAddBlog show={show} setShow={setShow} />
            <EditBlog show={show1} setShow={setShow1} id={idBlog} />
        </div>
    );
}

export default Blogger;

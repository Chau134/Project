const ModelPaymentsSuccess = require('../../model/ModelPaymentSuccess');
const ModelProducts = require('../../model/ModelProducts');

const { jwtDecode } = require('jwt-decode');
const ModelUser = require('../../model/ModelUser');
const sendMail = require('../ControllerEmail/SendEmail');

require('dotenv').config();

class ControllerAdmin {
    async GetDataOrder(req, res) {
        ModelPaymentsSuccess.find({}).then((data) => res.status(200).json(data));
    }

    async GetUser(req, res) {
        ModelUser.find({}).then((data) => res.status(200).json(data));
    }

    async AddProduct(req, res) {
        const { nameProduct, imgProduct, priceProduct, desProduct, checkProduct, checkType, quantityPro } = req.body; //
        try {
            let dataProduct = await ModelProducts.findOne({}).sort({ id: 'desc' }).exec();

            let newProductId = 1;
            if (dataProduct) {
                newProductId = dataProduct.id + 1;
            }

            const newProduct = new ModelProducts({
                id: newProductId,
                nameProducts: nameProduct,
                img: req.file.filename,
                priceNew: priceProduct,
                des: desProduct,
                checkProducts: checkProduct,
                checkType,
                quantityPro,
            });

            await newProduct.save();
            return res.status(200).json({ message: 'Thêm Sản Phẩm Thành Công !!!' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async DeleteProduct(req, res) {
        ModelProducts.deleteOne({ id: req.body.id }).then((dataProduct) =>
            res.status(200).json({ message: 'Xóa Sản Phẩm Thành Công !!!', dataProduct }),
        );
    }

    async EditProduct(req, res) {
        const { nameProduct, priceProduct, desProduct, valueProduct, checkProduct, checkType, id, quantityPro } =
            req.body;

        try {
            const dataProduct = await ModelProducts.findOne({ id });

            if (dataProduct) {
                await dataProduct.updateOne({
                    nameProducts: nameProduct || dataProduct.nameProducts,
                    img: req.file ? req.file.filename : dataProduct.img,
                    priceNew: priceProduct || dataProduct.priceNew,
                    des: desProduct || dataProduct.des,
                    quantityPro: quantityPro || dataProduct.quantityPro,
                    checkProducts: checkProduct || dataProduct.checkProducts,
                    checkType: checkType || dataProduct.checkType,
                });

                return res.status(200).json({ message: 'Sửa Thành Công !!!' });
            } else {
                return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
            }
        } catch (error) {
            return res.status(500).json({ message: 'Lỗi server', error });
        }
    }

    async GetDataAuth(req, res) {
        const token = req.cookies;
        const decoded = jwtDecode(token.Token);
        ModelUser.findOne({ email: decoded.email }).then((dataUser) => res.status(200).json({ dataUser }));
    }

    async checkProduct(req, res) {
        const dataProduct = await ModelPaymentsSuccess.deleteOne({ email: req.body.idProduct });
        if (dataProduct) {
            sendMail(req.body.idProduct);
            return res.status(200).json({ message: 'Success' });
        }
    }
    async EditOrder(req, res) {
        ModelPaymentsSuccess.findOne({ _id: req.body.id }).then((data) => {
            if (data) {
                data.updateOne({
                    statusOrder: req.body.valueTest == '1' || '0' ? req.body.valueTest === '2' : true,
                    statusPayment: req.body.valueTest1 == '1' || '0' ? req.body.valueTest1 === '2' : true,
                }).then((data) => res.status(200).json({ message: 'Chỉnh Sửa Thành Công !!!' }));
            }
        });
    }

    async EditUser(req, res) {
        const { valueSelect, email } = req.body;

        try {
            const data = await ModelUser.findOne({ email: email });
            if (data) {
                let updateFields = {};
                if (valueSelect === '3') {
                    updateFields = { isAdmin: true, isEmployee: false };
                } else if (valueSelect === '2') {
                    updateFields = { isAdmin: false, isEmployee: true };
                } else {
                    updateFields = { isAdmin: false, isEmployee: false };
                }

                await data.updateOne(updateFields);
                res.status(200).json({ message: 'Chỉnh Sửa Thành Công !!!' });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Server error', error });
        }
    }

    async statistical(req, res) {
        try {
            const now = new Date();
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(now.getDate() - 6); // Lấy 7 ngày (hôm nay + 6 ngày trước)
            const dataUser = await ModelUser.find({});
            const lengthUser = dataUser.length;

            // Truy vấn MongoDB
            const payments = await ModelPaymentsSuccess.aggregate([
                {
                    $match: {
                        createdAt: { $gte: sevenDaysAgo, $lte: now }, // Chỉ lấy đơn hàng trong 7 ngày gần nhất
                        statusPayment: true, // Chỉ tính các đơn đã thanh toán
                    },
                },
                {
                    $group: {
                        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, // Nhóm theo ngày
                        totalRevenue: { $sum: '$sumPrice' }, // Tính tổng doanh thu
                    },
                },
                { $sort: { _id: 1 } }, // Sắp xếp theo ngày tăng dần
            ]);

            // Chuẩn hóa dữ liệu: Đảm bảo trả về đủ 7 ngày, kể cả ngày không có giao dịch
            const result = [];
            for (let i = 6; i >= 0; i--) {
                const day = new Date();
                day.setDate(now.getDate() - i);
                const dayStr = day.toISOString().split('T')[0]; // YYYY-MM-DD

                // Tìm dữ liệu ngày hiện tại trong `payments`
                const dayData = payments.find((item) => item._id === dayStr);
                result.push({
                    date: dayStr,
                    totalRevenue: dayData ? dayData.totalRevenue : 0, // Giá trị mặc định là 0 nếu không có giao dịch
                });
            }

            // Trả về kết quả
            res.status(200).json({ result, lengthUser });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Lỗi server', error });
        }
    }
}

module.exports = new ControllerAdmin();

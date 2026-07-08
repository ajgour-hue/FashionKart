import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPayment } from "../service/cart.api";

const OrderStatus = () => {
    const { orderId } = useParams();
    const [payment, setPayment] = useState(null);

    useEffect(() => {
        async function fetchOrder() {
            const data = await getPayment(orderId);
            setPayment(data.payment);
        }

        fetchOrder();
    }, [orderId]);

    if (!payment) return <h2>Loading...</h2>;

    return (
        <div className="max-w-xl mx-auto mt-20 p-8 border rounded-lg">
            <h1 className="text-3xl font-bold mb-6">Order Status</h1>

            <p><strong>Order ID:</strong> {payment.razorpay.orderId}</p>

            <p>
                <strong>Status:</strong>{" "}
                <span className="text-green-600 font-semibold">
                    {payment.status.toUpperCase()}
                </span>
            </p>

            <p><strong>Total:</strong> ₹{payment.price.amount}</p>

            <h2 className="mt-6 font-semibold">Items</h2>

            {payment.orderItems.map((item) => (
                <div key={item.productId} className="mt-4 border-t pt-4">
                    <p>{item.title}</p>
                    <p>Quantity : {item.quantity}</p>
                </div>
            ))}

            <Link
                to="/"
                className="inline-block mt-8 px-6 py-3 bg-black text-white rounded"
            >
                Continue Shopping
            </Link>
        </div>
    );
};

export default OrderStatus;
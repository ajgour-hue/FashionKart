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

    if (!payment) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white px-6 py-16">
            <div className="max-w-2xl mx-auto">

                {/* Heading */}
                <div className="mb-10">
                    <span className="uppercase tracking-[3px] text-xs text-neutral-400">
                        Order Details
                    </span>
                    <h1 className="text-4xl font-semibold mt-2">
                        Order Status
                    </h1>
                </div>

                <div className="bg-neutral-50 rounded-xl p-6 md:p-8">

                    {/* Order meta */}
                    <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-neutral-200">
                        <div>
                            <p className="text-xs text-neutral-400 uppercase tracking-[2px] mb-1">
                                Order ID
                            </p>
                            <p className="font-medium">{payment.razorpay.orderId}</p>
                        </div>

                        <span className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-[1px]">
                            <i className="ri-checkbox-circle-fill"></i>
                            {payment.status.toUpperCase()}
                        </span>
                    </div>

                    {/* Total */}
                    <div className="flex items-center justify-between py-6 border-b border-neutral-200">
                        <span className="text-neutral-500">Total Paid</span>
                        <span className="text-2xl font-bold">₹ {payment.price.amount}</span>
                    </div>

                    {/* Items */}
                    <div className="pt-6">
                        <h2 className="font-semibold mb-4">Items</h2>

                        <div className="flex flex-col gap-4">
                            {payment.orderItems.map((item) => (
                                <div
                                    key={item.productId}
                                    className="flex items-center justify-between bg-white rounded-lg px-4 py-3 border border-neutral-200"
                                >
                                    <p className="font-medium">{item.title}</p>
                                    <p className="text-neutral-500 text-sm">Qty: {item.quantity}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <Link
                    to="/"
                    className="inline-block mt-8 bg-black text-white px-8 py-3 rounded-full hover:bg-neutral-800 transition"
                >
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
};

export default OrderStatus;
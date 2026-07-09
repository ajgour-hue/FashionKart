import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPayment } from "../service/cart.api.js";

const OrderSuccess = () => {

    const location = useLocation()
    const queryParams = new URLSearchParams(location.search)
    const orderId = queryParams.get("order_id") || "SN-00000"

    const [payment, setPayment] = useState(null)
    useEffect(() => {
        async function fetchOrder() {
            const data = await getPayment(orderId);
            setPayment(data.payment);
        }

        fetchOrder();
    }, [orderId]);


    if (!payment) {
        return <div className="min-h-screen flex items-center justify-center">
            Loading...
        </div>
    }

    return (
        <div className="min-h-screen pb-24 bg-white">
            <main className="pt-12 lg:pt-20 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">

                {/* Success icon + heading */}
                <div className="flex flex-col items-center text-center mb-16">
                    <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mb-6">
                        <i className="ri-checkbox-circle-fill text-4xl text-green-600"></i>
                    </div>
                    <span className="uppercase tracking-[3px] text-xs text-neutral-400">
                        Transaction Complete
                    </span>
                    <h1 className="text-4xl md:text-5xl font-semibold mt-3">
                        Your Order is Confirmed
                    </h1>
                    <p className="text-neutral-500 mt-3">
                        Order Reference — <span className="font-medium text-black">#{orderId}</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    {/* Left Column: Order Summary */}
                    <div className="lg:col-span-7">
                        <div className="bg-neutral-50 rounded-xl p-6 md:p-8">
                            <h3 className="text-xl font-semibold pb-4 border-b border-neutral-200">
                                Order Summary
                            </h3>

                            <div className="flex gap-5 items-center mt-6">
                                <div className="w-24 h-32 flex-shrink-0 overflow-hidden rounded-xl bg-neutral-100">
                                    <img
                                        className="w-full h-full object-cover"
                                        alt={payment.orderItems[0].title}
                                        src={payment.orderItems[0].images[0].url}
                                    />
                                </div>
                                <div className="flex-grow space-y-1">
                                    <h4 className="text-lg font-medium">
                                        {payment.orderItems[0].title}
                                    </h4>
                                    <p className="uppercase tracking-[3px] text-xs text-neutral-400">
                                        Green / M
                                    </p>
                                    <p className="font-semibold mt-2 text-xl">₹ {payment.price.amount}</p>
                                </div>
                            </div>

                            <div className="space-y-4 pt-6 mt-6 border-t border-neutral-200 text-sm">
                                <div className="flex justify-between text-neutral-500">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-black">₹ {payment.price.amount}</span>
                                </div>
                                <div className="flex justify-between text-neutral-500">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-medium">Complimentary</span>
                                </div>
                                <div className="flex justify-between text-lg font-semibold pt-3 border-t border-neutral-200">
                                    <span>Total</span>
                                    <span>₹ {payment.price.amount}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Delivery Details & Actions */}
                    <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-10 mt-6 lg:mt-0">

                        <div className="bg-neutral-50 rounded-xl p-6">
                            <h3 className="text-lg font-semibold mb-2">
                                Arrival Estimate
                            </h3>
                            <p className="text-neutral-500 leading-relaxed">
                                Your order is being prepared for transit. Expect arrival between{" "}
                                <span className="font-semibold text-black">October 24th – 26th</span>.
                            </p>
                        </div>

                        <div className="bg-neutral-50 rounded-xl p-6">
                            <h3 className="text-lg font-semibold mb-2">
                                Shipping Address
                            </h3>
                            <p className="text-neutral-500 leading-relaxed">
                                Julianne V. Sterling<br />
                                742 Avenue Montaigne, Apt 4B<br />
                                Paris, France 75008
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Link
                                to={`/order-status/${orderId}`}
                                className="bg-black text-white py-3 rounded-full text-center hover:bg-neutral-800 transition"
                            >
                                View Order Status
                            </Link>

                            <Link
                                to="/"
                                className="border border-black py-3 rounded-full text-center hover:bg-black hover:text-white transition"
                            >
                                Continue Shopping
                            </Link>
                        </div>

                        <p className="text-xs text-neutral-400 leading-relaxed pt-6 border-t border-neutral-200">
                            A confirmation email has been dispatched. For alterations or inquiries, please contact our support team.
                        </p>
                    </div>

                </div>
            </main>
        </div>
    )
}

export default OrderSuccess
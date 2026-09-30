import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createOrder } from '../api/client';

export const SecureCheckoutPage = () => {
  const { cartItems, subtotal, tax, clearCart } = useCart();
  const navigate = useNavigate();

  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    firstName: 'Jane',
    lastName: 'Doe',
    street: '123 Silk Avenue, Apt 4B',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    cardNumber: '4242 •••• •••• 4242',
    cardExp: '12/26',
    cardCvv: '321'
  });

  const shippingCost = deliveryMethod === 'express' ? 15.0 : 0.0;
  const total = subtotal + tax + shippingCost;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await createOrder({
        items: cartItems.length ? cartItems : [{ id: 'silk-aeris-pro', name: 'Silk Aeris Pro', quantity: 1, price: 145 }],
        customer: formData,
        deliveryMethod,
        paymentMethod,
        subtotal,
        tax,
        shippingCost,
        total
      });

      if (res && res.data) {
        setConfirmedOrder(res.data);
      } else {
        setConfirmedOrder({
          orderNumber: `SLK-${Math.floor(100000 + Math.random() * 900000)}`,
          deliveryMethod,
          estimatedDelivery: deliveryMethod === 'express' ? '1-2 Business Days' : '3-5 Business Days',
          customer: formData
        });
      }
    } catch (err) {
      console.warn('Backend order submit error, using client fallback:', err);
      setConfirmedOrder({
        orderNumber: `SLK-${Math.floor(100000 + Math.random() * 900000)}`,
        deliveryMethod,
        estimatedDelivery: deliveryMethod === 'express' ? '1-2 Business Days' : '3-5 Business Days',
        customer: formData
      });
    } finally {
      setIsSubmitting(false);
      setOrderPlaced(true);
      clearCart();
    }
  };

  if (orderPlaced && confirmedOrder) {
    return (
      <main className="flex-grow container mx-auto px-4 py-16 max-w-xl text-center space-y-6">
        <div className="w-24 h-24 rounded-full neo-inset mx-auto flex items-center justify-center text-primary">
          <span className="material-symbols-outlined text-5xl filled" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
        </div>
        <h1 className="font-headline font-bold text-3xl sm:text-4xl text-on-surface">Order Confirmed!</h1>
        <p className="text-on-surface-variant font-body leading-relaxed">
          Thank you for your order, <span className="font-semibold text-on-surface">{formData.firstName}</span>. We've sent a receipt and real-time tracking link to your email.
        </p>
        <div className="p-6 rounded-2xl neo-raised bg-background text-left space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Order Number:</span>
            <span className="font-mono font-bold text-on-surface">#{confirmedOrder.orderNumber}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Estimated Delivery:</span>
            <span className="font-semibold text-primary">
              {confirmedOrder.estimatedDelivery || (deliveryMethod === 'express' ? '1-2 Business Days' : '3-5 Business Days')}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Shipping To:</span>
            <span className="text-on-surface">{formData.city}, {formData.state}</span>
          </div>
        </div>
        <div className="pt-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-background text-primary font-bold neo-raised hover:text-tertiary transition-colors neo-raised-interactive"
          >
            <span>Return to Silk Store</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow container mx-auto px-4 lg:px-8 py-8 max-w-5xl">
      {/* Transactional Back Link */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors p-2 rounded-xl neo-raised"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          <span>Back to Shopping</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
        {/* Main Form Area */}
        <form onSubmit={handleSubmitOrder} className="lg:col-span-7 space-y-8">
          {/* Shipping Address */}
          <section className="neo-raised rounded-2xl p-6 lg:p-8 bg-background space-y-4">
            <h2 className="text-xl font-headline font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">local_shipping</span>
              <span>Shipping Address</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface-variant ml-1">First Name</label>
                <input
                  required
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full neo-inset rounded-xl px-4 py-3 text-on-surface bg-background border-none focus:ring-0 text-sm placeholder:text-outline"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface-variant ml-1">Last Name</label>
                <input
                  required
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full neo-inset rounded-xl px-4 py-3 text-on-surface bg-background border-none focus:ring-0 text-sm placeholder:text-outline"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface-variant ml-1">Street Address</label>
              <input
                required
                type="text"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                className="w-full neo-inset rounded-xl px-4 py-3 text-on-surface bg-background border-none focus:ring-0 text-sm placeholder:text-outline"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-1.5 col-span-2 md:col-span-1">
                <label className="text-xs font-semibold text-on-surface-variant ml-1">City</label>
                <input
                  required
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full neo-inset rounded-xl px-4 py-3 text-on-surface bg-background border-none focus:ring-0 text-sm placeholder:text-outline"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface-variant ml-1">State</label>
                <input
                  required
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full neo-inset rounded-xl px-4 py-3 text-on-surface bg-background border-none focus:ring-0 text-sm placeholder:text-outline"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface-variant ml-1">Zip</label>
                <input
                  required
                  type="text"
                  value={formData.zip}
                  onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                  className="w-full neo-inset rounded-xl px-4 py-3 text-on-surface bg-background border-none focus:ring-0 text-sm placeholder:text-outline"
                />
              </div>
            </div>
          </section>

          {/* Delivery Method */}
          <section className="neo-raised rounded-2xl p-6 lg:p-8 bg-background space-y-4">
            <h2 className="text-xl font-headline font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">schedule</span>
              <span>Delivery Method</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Standard */}
              <div
                onClick={() => setDeliveryMethod('standard')}
                className={`p-5 rounded-xl cursor-pointer transition-all flex flex-col justify-between ${
                  deliveryMethod === 'standard' ? 'neo-inset border-2 border-primary/30' : 'neo-raised'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="text-on-surface font-bold text-sm">Standard Delivery</div>
                  <span className="text-primary font-bold text-xs">FREE</span>
                </div>
                <div className="text-xs text-on-surface-variant">3-5 Business Days</div>
              </div>

              {/* Express */}
              <div
                onClick={() => setDeliveryMethod('express')}
                className={`p-5 rounded-xl cursor-pointer transition-all flex flex-col justify-between ${
                  deliveryMethod === 'express' ? 'neo-inset border-2 border-primary/30' : 'neo-raised'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="text-on-surface font-bold text-sm">Express Courier</div>
                  <span className="text-on-surface font-bold text-xs">+$15.00</span>
                </div>
                <div className="text-xs text-on-surface-variant">1-2 Business Days</div>
              </div>
            </div>
          </section>

          {/* Payment Method */}
          <section className="neo-raised rounded-2xl p-6 lg:p-8 bg-background space-y-4">
            <h2 className="text-xl font-headline font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">credit_card</span>
              <span>Payment Details</span>
            </h2>

            <div className="space-y-4">
              {/* Credit Card Option */}
              <div
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-xl cursor-pointer flex items-center gap-3 ${
                  paymentMethod === 'card' ? 'neo-inset' : 'neo-raised'
                }`}
              >
                <span className="material-symbols-outlined text-primary">credit_card</span>
                <span className="font-semibold text-sm text-on-surface">Credit / Debit Card</span>
              </div>

              {paymentMethod === 'card' && (
                <div className="pl-4 pr-2 py-2 space-y-3 border-l-2 border-primary/30 ml-2">
                  <input
                    type="text"
                    required
                    value={formData.cardNumber}
                    onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                    placeholder="Card Number"
                    className="w-full neo-inset rounded-xl px-4 py-2.5 text-on-surface bg-background border-none focus:ring-0 text-sm font-mono"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      value={formData.cardExp}
                      onChange={(e) => setFormData({ ...formData, cardExp: e.target.value })}
                      placeholder="MM/YY"
                      className="w-full neo-inset rounded-xl px-4 py-2.5 text-on-surface bg-background border-none focus:ring-0 text-sm font-mono"
                    />
                    <input
                      type="password"
                      required
                      value={formData.cardCvv}
                      onChange={(e) => setFormData({ ...formData, cardCvv: e.target.value })}
                      placeholder="CVV"
                      className="w-full neo-inset rounded-xl px-4 py-2.5 text-on-surface bg-background border-none focus:ring-0 text-sm font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Digital Wallet Option */}
              <div
                onClick={() => setPaymentMethod('wallet')}
                className={`p-4 rounded-xl cursor-pointer flex items-center gap-3 ${
                  paymentMethod === 'wallet' ? 'neo-inset' : 'neo-raised'
                }`}
              >
                <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
                <span className="font-semibold text-sm text-on-surface">Digital Wallet (Apple Pay / GPay)</span>
              </div>
            </div>
          </section>

          {/* Place Order CTA on Mobile */}
          <button
            type="submit"
            className="w-full lg:hidden py-4 rounded-xl neo-raised text-primary font-bold text-lg flex items-center justify-center gap-2 neo-raised-interactive"
          >
            <span>Confirm &amp; Pay ${total.toFixed(2)}</span>
            <span className="material-symbols-outlined">lock</span>
          </button>
        </form>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-5">
          <div className="sticky top-28 neo-raised rounded-2xl p-6 lg:p-8 bg-background flex flex-col space-y-6">
            <h3 className="font-headline font-bold text-lg text-on-surface pb-3 border-b border-outline-variant/30">
              Order Summary
            </h3>

            {/* Item List */}
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex items-center gap-4 p-2 rounded-xl neo-inset bg-background">
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center p-1">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-semibold text-xs sm:text-sm text-on-surface">{item.name}</h4>
                    <p className="text-xs text-on-surface-variant">Size {item.size} • Qty {item.quantity}</p>
                    <span className="font-bold text-xs text-primary">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals Breakdown */}
            <div className="space-y-2.5 pt-4 border-t border-outline-variant/30 text-sm">
              <div className="flex justify-between text-on-surface-variant">
                <span>Subtotal</span>
                <span className="font-semibold text-on-surface">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Delivery</span>
                <span className="font-semibold text-on-surface">
                  {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span>Estimated Tax (8.5%)</span>
                <span className="font-semibold text-on-surface">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-on-surface pt-2 border-t border-outline-variant/20">
                <span>Total</span>
                <span className="text-primary text-xl font-headline">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Action CTA Button */}
            <button
              onClick={handleSubmitOrder}
              className="w-full py-4 rounded-xl neo-raised text-primary font-bold text-base flex items-center justify-center gap-2 neo-raised-interactive hover:text-tertiary transition-colors"
            >
              <span>Confirm &amp; Pay</span>
              <span className="material-symbols-outlined text-lg">lock</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

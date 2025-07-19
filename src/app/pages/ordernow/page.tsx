'use client';

import { useState } from 'react';
import ItemSelector from './item-selector';
import emailjs from '@emailjs/browser';

export default function OrderForm() {
  const [userInfo, setUserInfo] = useState({ name: '', email: '', phone: '' });
  const [orderItems, setOrderItems] = useState<{ [key: string]: number }>({});
  const [status, setStatus] = useState('');

  const sendOrder = (e: React.FormEvent) => {
    e.preventDefault();

    const templateParams = {
      from_name: userInfo.name,
      from_email: userInfo.email,
      phone: userInfo.phone,
      order: JSON.stringify(orderItems),
    };

    setStatus('Sending...');

    emailjs.send('your_service_id', 'your_template_id', templateParams, 'your_public_key')
      .then(() => setStatus('Order sent! 🎉 We will confirm via WhatsApp or Email.'))
      .catch(() => setStatus('Something went wrong. Please try again.'));
  };

  return (
    <section className='py-20'>
        <form onSubmit={sendOrder} className="space-y-8 max-w-3xl p-10 mx-auto bg-white border border-amber-900 rounded">
        <h2 className="text-3xl font-bungee text-center text-amber-900">Order Now</h2>

        <div className="space-y-4">
            <input
            type="text"
            required
            placeholder="Your Name"
            className="w-full border border-amber-900 px-4 py-2 rounded"
            value={userInfo.name}
            onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
            />
            <input
            type="email"
            required
            placeholder="Email Address"
            className="w-full border border-amber-900 px-4 py-2 rounded"
            value={userInfo.email}
            onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
            />
            <input
            type="tel"
            required
            placeholder="Number"
            className="w-full border border-amber-900 px-4 py-2 rounded"
            value={userInfo.phone}
            onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
            />
        </div>

        <ItemSelector onSelectionChange={setOrderItems} />

        <p className="text-sm text-red-600 font-semibold">
            ⚠️ Orders only count after paying 50% deposit. Please send proof via WhatsApp or email. Payment gateway is coming soon.
        </p>

        <button
            type="submit"
            className="bg-amber-900 text-white px-6 py-2 rounded hover:bg-amber-700"
        >
            Submit Order
        </button>

        {status && <p className="text-center mt-4">{status}</p>}
        </form>
    </section>
  );
}

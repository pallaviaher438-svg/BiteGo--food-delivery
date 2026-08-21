import React, { useState } from 'react';
import { Order } from '../types';

interface DriverChatModalProps {
  order: Order;
  onClose: () => void;
}

export const DriverChatModal: React.FC<DriverChatModalProps> = ({ order, onClose }) => {
  const [messages, setMessages] = useState<{ sender: 'user' | 'driver'; text: string; time: string }[]>([
    { sender: 'driver', text: `Hi! I'm on my way to deliver your order from ${order.restaurantName}.`, time: '7:30 PM' },
    { sender: 'driver', text: 'Will arrive in about 10-12 mins.', time: '7:31 PM' }
  ]);
  const [inputText, setInputText] = useState('');

  const quickReplies = ['Please leave it at the door', 'Call me when you reach gate', 'Ring the doorbell', 'Coming down now'];

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [
      ...prev,
      { sender: 'user', text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    setInputText('');

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { sender: 'driver', text: 'Got it! Thanks for letting me know.', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md h-[520px] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Chat Header */}
        <div className="bg-[#29695b] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={order.deliveryPartner.avatar} alt="Driver" className="w-10 h-10 rounded-full object-cover border-2 border-white" />
            <div>
              <h3 className="font-bold text-sm">{order.deliveryPartner.name}</h3>
              <p className="text-xs text-[#afefdd]">Delivery Partner • {order.deliveryPartner.vehicleNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 text-white">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#fbf9f8]">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] p-3 rounded-2xl text-xs ${
                m.sender === 'user'
                  ? 'bg-[#a83300] text-white rounded-br-none'
                  : 'bg-white text-[#1b1c1c] shadow-sm border border-[#e4e2e1] rounded-bl-none'
              }`}>
                <p>{m.text}</p>
                <span className={`text-[9px] block text-right mt-1 ${m.sender === 'user' ? 'text-white/70' : 'text-gray-400'}`}>
                  {m.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Replies */}
        <div className="px-3 py-2 bg-white border-t border-[#e4e2e1] flex gap-2 overflow-x-auto hide-scrollbar">
          {quickReplies.map((qr, i) => (
            <button
              key={i}
              onClick={() => sendMessage(qr)}
              className="text-[11px] whitespace-nowrap px-2.5 py-1 bg-[#f0eded] text-[#5c4037] rounded-full hover:bg-[#ffdbd0] hover:text-[#a83300] transition-colors"
            >
              {qr}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="p-3 bg-white border-t border-[#e4e2e1] flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage(inputText)}
            placeholder="Type a message to driver..."
            className="flex-1 text-xs bg-[#f6f3f2] px-3 py-2 rounded-full outline-none focus:ring-1 focus:ring-[#29695b]"
          />
          <button
            onClick={() => sendMessage(inputText)}
            className="w-8 h-8 rounded-full bg-[#29695b] text-white flex items-center justify-center hover:bg-[#065043]"
          >
            <span className="material-symbols-outlined text-[16px]">send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const DriverCallModal: React.FC<{ order: Order; onClose: () => void }> = ({ order, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-[#1b1c1c] text-white rounded-3xl w-full max-w-sm p-6 flex flex-col items-center text-center shadow-2xl">
        <div className="relative mb-4">
          <img src={order.deliveryPartner.avatar} alt="Driver" className="w-24 h-24 rounded-full object-cover border-4 border-[#29695b] shadow-xl" />
          <span className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-500 rounded-full border-2 border-black flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-[14px]">call</span>
          </span>
        </div>
        <h3 className="font-headline font-bold text-xl mb-1">{order.deliveryPartner.name}</h3>
        <p className="text-xs text-gray-400 mb-1">Calling delivery partner (masked number)</p>
        <p className="text-sm font-semibold text-[#afefdd] mb-6">{order.deliveryPartner.phone}</p>

        <div className="w-full bg-white/10 rounded-xl p-3 mb-6 text-xs text-left text-gray-300">
          <span className="font-semibold text-white block mb-0.5">Order #{order.orderNumber}</span>
          <span>Delivering from {order.restaurantName}</span>
        </div>

        <button
          onClick={onClose}
          className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95"
        >
          <span className="material-symbols-outlined text-2xl">call_end</span>
        </button>
      </div>
    </div>
  );
};

export const ReceiptModal: React.FC<{ order: Order; onClose: () => void }> = ({ order, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 shadow-2xl animate-in fade-in">
        <div className="flex justify-between items-start border-b border-[#e4e2e1] pb-4 mb-4">
          <div>
            <div className="font-display font-bold text-xl text-[#a83300]">BiteGo</div>
            <p className="text-xs text-gray-500">Order Tax Invoice & Receipt</p>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="text-xs space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-gray-500">Order Number:</span>
            <span className="font-bold text-[#1b1c1c]">{order.orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Date & Time:</span>
            <span>{order.placedAt}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Restaurant:</span>
            <span className="font-semibold">{order.restaurantName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Payment Mode:</span>
            <span className="uppercase font-semibold text-[#29695b]">{order.paymentMethod}</span>
          </div>
        </div>

        <div className="border-t border-b border-dashed border-gray-300 py-3 mb-4 space-y-2">
          {order.items.map((ci, i) => (
            <div key={i} className="flex justify-between text-xs">
              <span>{ci.quantity}x {ci.item.name}</span>
              <span className="font-semibold">₹{ci.item.price * ci.quantity}</span>
            </div>
          ))}
        </div>

        <div className="text-xs space-y-1.5 mb-6">
          <div className="flex justify-between text-gray-600">
            <span>Item Subtotal</span>
            <span>₹{order.itemTotal}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Delivery Partner Fee</span>
            <span>₹{order.deliveryFee}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Taxes & Restaurant Packaging</span>
            <span>₹{order.taxes}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-600 font-medium">
              <span>Coupon Discount ({order.couponApplied})</span>
              <span>-₹{order.discount}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-bold text-[#1b1c1c] border-t border-gray-200 pt-2">
            <span>Total Paid</span>
            <span className="text-[#a83300]">₹{order.total}</span>
          </div>
        </div>

        <div className="bg-[#f6f3f2] p-3 rounded-lg text-[11px] text-gray-500 text-center mb-4">
          Delivered to: {order.address.addressLine}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-[#a83300] text-white rounded-xl font-semibold text-xs hover:bg-[#d24200] transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export const SupportModal: React.FC<{ order: Order; onClose: () => void }> = ({ order, onClose }) => {
  const [resolved, setResolved] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);

  const issues = [
    'Where is my order?',
    'Items missing or incorrect',
    'Food temperature / quality issue',
    'Delivery partner issue',
    'Cancel or refund request'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#a83300]">support_agent</span>
            <h3 className="font-bold text-base">BiteGo 24/7 Support</h3>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {resolved ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-2xl">check_circle</span>
            </div>
            <h4 className="font-bold text-sm mb-1">Ticket #TK-{Math.floor(1000 + Math.random()*9000)} Created</h4>
            <p className="text-xs text-gray-600 mb-4">Our Nashik support executive is on it and will resolve your issue within 5 minutes.</p>
            <button onClick={onClose} className="px-6 py-2 bg-[#29695b] text-white text-xs font-semibold rounded-lg">
              Close
            </button>
          </div>
        ) : (
          <div>
            <p className="text-xs text-gray-600 mb-3">How can we assist you with order #{order.orderNumber}?</p>
            <div className="space-y-2 mb-4">
              {issues.map((issue, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedIssue(issue)}
                  className={`w-full text-left p-3 rounded-lg border text-xs transition-colors ${
                    selectedIssue === issue ? 'border-[#a83300] bg-[#ffdbd0]/30 font-semibold text-[#a83300]' : 'border-[#e4e2e1] hover:bg-[#f6f3f2]'
                  }`}
                >
                  {issue}
                </button>
              ))}
            </div>
            <button
              disabled={!selectedIssue}
              onClick={() => setResolved(true)}
              className="w-full py-2.5 bg-[#a83300] disabled:bg-gray-300 text-white rounded-xl font-semibold text-xs"
            >
              Get Instant Resolution
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const ReviewModal: React.FC<{ order: Order; onClose: () => void; onSubmit: (rating: number, comment: string) => void }> = ({ order, onClose, onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-base">Rate Your Experience</h3>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-700">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <p className="text-xs text-gray-600 mb-4">How was the food from <span className="font-semibold text-black">{order.restaurantName}</span>?</p>

        <div className="flex justify-center gap-2 mb-5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              className="text-3xl transition-transform hover:scale-110 active:scale-95"
            >
              <span className={`material-symbols-outlined text-3xl ${rating >= star ? 'text-amber-500 fill' : 'text-gray-300'}`}>
                star
              </span>
            </button>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share details about flavor, packaging, or delivery speed..."
          className="w-full h-24 p-3 bg-[#f6f3f2] rounded-xl text-xs outline-none focus:ring-1 focus:ring-[#a83300] mb-4 resize-none"
        />

        <button
          onClick={() => {
            onSubmit(rating, comment || 'Great food and super fast delivery!');
            onClose();
          }}
          className="w-full py-2.5 bg-[#a83300] text-white rounded-xl font-semibold text-xs hover:bg-[#d24200]"
        >
          Submit Review
        </button>
      </div>
    </div>
  );
};

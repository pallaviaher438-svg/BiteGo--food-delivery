import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { ReviewModal, ReceiptModal } from '../components/Modals';
import { Order } from '../types';

export const OrdersView: React.FC = () => {
  const { orders, setActiveOrderId, setCurrentScreen, setSelectedRestaurantId, addToCart, restaurants, addReview } = useApp();
  const [reviewingOrder, setReviewingOrder] = useState<Order | null>(null);
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'on_the_way':
        return <span className="bg-[#ffdbd0] text-[#832600] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#a83300] animate-ping"></span> On The Way</span>;
      case 'preparing':
        return <span className="bg-[#ffddb3] text-[#7f5300] text-[10px] font-bold px-2 py-0.5 rounded-full">Preparing</span>;
      case 'confirmed':
        return <span className="bg-[#acedda] text-[#2e6d5f] text-[10px] font-bold px-2 py-0.5 rounded-full">Confirmed</span>;
      case 'delivered':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Delivered</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Completed</span>;
    }
  };

  const handleReorder = (order: Order) => {
    const rest = restaurants.find(r => r.id === order.restaurantId) || restaurants[0];
    order.items.forEach(ci => {
      addToCart(rest, ci.item);
    });
    setSelectedRestaurantId(order.restaurantId);
    setCurrentScreen('cart');
  };

  return (
    <div className="bg-[#fbf9f8] text-[#1b1c1c] min-h-screen pb-24 md:pb-12">
      <Header title="Your Orders" showBack={false} />

      <main className="max-w-[800px] mx-auto px-4 md:px-8 py-4 space-y-4">
        <h1 className="font-headline font-bold text-xl md:text-2xl text-[#1b1c1c]">Order History</h1>

        {orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#e4e2e1]">
            <span className="material-symbols-outlined text-5xl text-[#907065] mb-2">receipt_long</span>
            <h3 className="font-bold text-base">No orders yet</h3>
            <p className="text-xs text-[#5c4037] mt-1 mb-4">Discover tasty meals in Nashik today!</p>
            <button
              onClick={() => setCurrentScreen('home')}
              className="px-6 py-2.5 bg-[#a83300] text-white text-xs font-bold rounded-xl"
            >
              Browse Restaurants
            </button>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-[#e4e2e1] space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-headline font-bold text-base text-[#1b1c1c]">{order.restaurantName}</h3>
                  <p className="text-xs text-[#5c4037]">Order #{order.orderNumber} • {order.placedAt}</p>
                </div>
                {getStatusBadge(order.status)}
              </div>

              <div className="border-t border-b border-[#f0eded] py-2.5 space-y-1 text-xs text-[#5c4037]">
                {order.items.map((ci, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{ci.quantity}x {ci.item.name}</span>
                    <span className="font-medium text-[#1b1c1c]">₹{ci.item.price * ci.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-sm text-[#a83300]">Total: ₹{order.total}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setReceiptOrder(order)}
                    className="px-3 py-1.5 border border-[#e4e2e1] hover:bg-[#f6f3f2] rounded-lg font-semibold text-xs text-[#5c4037]"
                  >
                    Invoice
                  </button>

                  {order.status !== 'delivered' ? (
                    <button
                      onClick={() => {
                        setActiveOrderId(order.id);
                        setCurrentScreen('track');
                      }}
                      className="px-4 py-1.5 bg-[#a83300] hover:bg-[#d24200] text-white rounded-lg font-bold text-xs flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[16px]">navigation</span>
                      Track
                    </button>
                  ) : (
                    <>
                      {!order.review && (
                        <button
                          onClick={() => setReviewingOrder(order)}
                          className="px-3 py-1.5 bg-[#ffdbd0] text-[#832600] rounded-lg font-bold text-xs"
                        >
                          Rate Food
                        </button>
                      )}
                      <button
                        onClick={() => handleReorder(order)}
                        className="px-3 py-1.5 bg-[#29695b] hover:bg-[#065043] text-white rounded-lg font-bold text-xs"
                      >
                        Reorder
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </main>

      {reviewingOrder && (
        <ReviewModal
          order={reviewingOrder}
          onClose={() => setReviewingOrder(null)}
          onSubmit={(r, c) => addReview(reviewingOrder.id, r, c)}
        />
      )}

      {receiptOrder && (
        <ReceiptModal
          order={receiptOrder}
          onClose={() => setReceiptOrder(null)}
        />
      )}

      <BottomNav />
    </div>
  );
};

import React, { useState } from 'react';
import { Order } from '../types';

interface DeliveryDashboardProps {
  orders: Order[];
  activeOrder?: Order | null;
  onNavigateToTask: () => void;
  isOnDuty: boolean;
}

export const DeliveryDashboard: React.FC<DeliveryDashboardProps> = ({
  orders,
  activeOrder,
  onNavigateToTask,
  isOnDuty
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'today' | 'week' | 'month'>('today');
  const [cashoutModalOpen, setCashoutModalOpen] = useState(false);
  const [cashoutSuccess, setCashoutSuccess] = useState(false);
  const [activeZone, setActiveZone] = useState<string>('college_rd');

  const completedCount = orders.filter(o => o.status === 'delivered').length + 14;
  const todayEarnings = 1245;
  const weeklyEarnings = 8920;
  const monthlyEarnings = 34800;

  const currentEarnings =
    selectedTimeframe === 'today'
      ? todayEarnings
      : selectedTimeframe === 'week'
      ? weeklyEarnings
      : monthlyEarnings;

  // Nashik Real-Time Hotspot Surge Zones
  const hotspotZones = [
    {
      id: 'college_rd',
      name: 'College Road & Bardan Phata',
      distance: '1.2 km away',
      surge: '1.4x Surge',
      surgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      activeOrders: 18,
      avgWait: '3 mins',
      bonus: '+₹25/order'
    },
    {
      id: 'gangapur_rd',
      name: 'Gangapur Road & Anandwalli',
      distance: '2.8 km away',
      surge: '1.2x Surge',
      surgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      activeOrders: 12,
      avgWait: '5 mins',
      bonus: '+₹15/order'
    },
    {
      id: 'indira_nagar',
      name: 'Indira Nagar & Mumbai Naka',
      distance: '4.1 km away',
      surge: '1.1x Surge',
      surgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
      activeOrders: 8,
      avgWait: '7 mins',
      bonus: '+₹10/order'
    },
    {
      id: 'panchavati',
      name: 'Panchavati & Goda Ghat',
      distance: '5.5 km away',
      surge: 'Standard 1.0x',
      surgeColor: 'bg-gray-100 text-gray-800 border-gray-200',
      activeOrders: 5,
      avgWait: '8 mins',
      bonus: '+₹0/order'
    }
  ];

  // Weekly earning breakdown chart points
  const weeklyDays = [
    { day: 'Mon', amount: 1120, height: '65%' },
    { day: 'Tue', amount: 1340, height: '78%' },
    { day: 'Wed', amount: 980, height: '56%' },
    { day: 'Thu', amount: 1450, height: '85%' },
    { day: 'Fri', amount: 1680, height: '98%' },
    { day: 'Sat', amount: 1540, height: '90%' },
    { day: 'Sun (Today)', amount: 1245, height: '72%', isToday: true }
  ];

  const handleCashout = (e: React.FormEvent) => {
    e.preventDefault();
    setCashoutSuccess(true);
    setTimeout(() => {
      setCashoutSuccess(false);
      setCashoutModalOpen(false);
    }, 2000);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Active Task Banner if In-Progress Order Exists */}
      {activeOrder && activeOrder.status !== 'delivered' && (
        <div className="bg-gradient-to-r from-[#a83300] to-[#c2410c] text-white p-3.5 sm:p-4 rounded-3xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0">
              <span className="material-symbols-outlined text-[22px] animate-pulse">two_wheeler</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                  Delivery in Progress
                </span>
                <span className="font-mono text-xs font-bold text-white/90">#{activeOrder.orderNumber}</span>
              </div>
              <p className="font-headline font-bold text-sm sm:text-base truncate mt-0.5">
                {activeOrder.restaurantName} → {activeOrder.address.label} ({activeOrder.address.addressLine})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onNavigateToTask}
            className="px-4 py-2 bg-white text-[#a83300] hover:bg-white/90 font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 self-start sm:self-auto shrink-0 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">navigation</span>
            <span>Open Route Tracker</span>
          </button>
        </div>
      )}

      {/* Top 4 Responsive Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        
        {/* Card 1: Today's Net Earnings */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-[#e4e2e1] flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#5c4037] uppercase tracking-wider">
              {selectedTimeframe === 'today' ? "Today's Payout" : selectedTimeframe === 'week' ? "This Week" : "This Month"}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">currency_rupee</span>
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-headline font-bold text-2xl sm:text-3xl text-[#1b1c1c]">
                ₹{currentEarnings.toLocaleString()}
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md">
                +14.2%
              </span>
            </div>
            <p className="text-[11px] text-[#5c4037] mt-0.5">
              Includes ₹180 surge + ₹60 tips
            </p>
          </div>

          <button
            type="button"
            onClick={() => setCashoutModalOpen(true)}
            className="w-full py-2 bg-[#29695b] hover:bg-[#1e5246] text-white text-xs font-bold rounded-xl shadow-2xs transition-all flex items-center justify-center gap-1 active:scale-[0.99]"
          >
            <span className="material-symbols-outlined text-[15px]">send_to_mobile</span>
            <span>Instant UPI Cashout</span>
          </button>
        </div>

        {/* Card 2: Trips Completed & Target */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-[#e4e2e1] flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#5c4037] uppercase tracking-wider">
              Trips Completed
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">sports_score</span>
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-headline font-bold text-2xl sm:text-3xl text-[#1b1c1c]">
                {completedCount}
              </span>
              <span className="text-xs text-[#5c4037]">/ 15 Daily Goal</span>
            </div>
            <div className="w-full h-2 bg-[#f0eded] rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-500 to-[#a83300] rounded-full" style={{ width: '93%' }} />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#5c4037] pt-1 border-t border-[#f0eded]">
            <span>1 trip to +₹150 Bonus</span>
            <span className="font-bold text-amber-700">93% Done</span>
          </div>
        </div>

        {/* Card 3: Avg Speed & Delivery Time */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-[#e4e2e1] flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#5c4037] uppercase tracking-wider">
              Avg Delivery Time
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">schedule</span>
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-headline font-bold text-2xl sm:text-3xl text-[#1b1c1c]">
                18.4
              </span>
              <span className="text-xs font-bold text-[#5c4037]">mins</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md">
                -2.6m fast
              </span>
            </div>
            <p className="text-[11px] text-[#5c4037] mt-0.5">
              Top 5% speed in Nashik Metro
            </p>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#5c4037] pt-1 border-t border-[#f0eded]">
            <span>On-Time SLA:</span>
            <span className="font-bold text-emerald-700">99.2%</span>
          </div>
        </div>

        {/* Card 4: Customer Satisfaction & Rating */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-[#e4e2e1] flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#5c4037] uppercase tracking-wider">
              Customer Rating
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">star</span>
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-headline font-bold text-2xl sm:text-3xl text-[#1b1c1c]">
                4.92
              </span>
              <span className="text-xs font-bold text-amber-500">★ ★ ★ ★ ★</span>
            </div>
            <p className="text-[11px] text-[#5c4037] mt-0.5">
              184 five-star ratings this month
            </p>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#5c4037] pt-1 border-t border-[#f0eded]">
            <span>Badge:</span>
            <span className="font-bold text-[#29695b] bg-[#acedda]/30 px-2 py-0.2 rounded-full">
              Super Rider Elite
            </span>
          </div>
        </div>
      </div>

      {/* Main Responsive Split: Earnings & Hotspots Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
        
        {/* Left Column (7 cols): Weekly Earnings Bar Chart & Shift Stats */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Earnings Analytics Card */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xs border border-[#e4e2e1] space-y-4">
            <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 pb-3 border-b border-[#f0eded]">
              <div>
                <h3 className="font-headline font-bold text-base text-[#1b1c1c] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#29695b] text-[20px]">bar_chart</span>
                  <span>Weekly Earnings Breakdown</span>
                </h3>
                <p className="text-[11px] text-[#5c4037]">Total weekly payout: ₹8,920 (Mon - Sun)</p>
              </div>

              {/* Timeframe selector */}
              <div className="flex items-center gap-1 bg-[#f6f3f2] p-1 rounded-xl border border-[#e4e2e1] self-start xs:self-auto">
                {(['today', 'week', 'month'] as const).map((tf) => (
                  <button
                    key={tf}
                    type="button"
                    onClick={() => setSelectedTimeframe(tf)}
                    className={`px-2.5 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider transition-all ${
                      selectedTimeframe === tf
                        ? 'bg-white text-[#a83300] shadow-xs'
                        : 'text-[#5c4037] hover:text-[#1b1c1c]'
                    }`}
                  >
                    {tf === 'today' ? 'Today' : tf === 'week' ? 'Weekly' : 'Monthly'}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom SVG / Bar Visualizer */}
            <div className="h-48 pt-6 pb-2 flex items-end justify-between gap-2 border-b border-[#f0eded]">
              {weeklyDays.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <span className="text-[10px] font-bold text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    ₹{d.amount}
                  </span>
                  <div className="w-full max-w-[32px] bg-[#f0eded] rounded-xl overflow-hidden h-full flex items-end">
                    <div
                      className={`w-full rounded-xl transition-all duration-500 ${
                        d.isToday
                          ? 'bg-gradient-to-t from-[#29695b] to-[#3ca08d] shadow-sm ring-2 ring-[#29695b]/30'
                          : 'bg-gradient-to-t from-[#dedad8] to-[#bbb6b3] group-hover:from-[#a83300] group-hover:to-[#ff8d60]'
                      }`}
                      style={{ height: d.height }}
                    />
                  </div>
                  <span className={`text-[10px] font-bold ${d.isToday ? 'text-[#29695b]' : 'text-[#5c4037]'}`}>
                    {d.day.split(' ')[0]}
                  </span>
                </div>
              ))}
            </div>

            {/* Sub-metrics row */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 bg-[#fcfaf9] rounded-xl border border-[#e4e2e1]">
                <span className="text-[10px] text-[#5c4037] uppercase font-bold block">Base Fare</span>
                <span className="font-bold text-[#1b1c1c]">₹6,840</span>
              </div>
              <div className="p-2 bg-[#fcfaf9] rounded-xl border border-[#e4e2e1]">
                <span className="text-[10px] text-[#5c4037] uppercase font-bold block">Peak Surges</span>
                <span className="font-bold text-[#a83300]">₹1,420</span>
              </div>
              <div className="p-2 bg-[#fcfaf9] rounded-xl border border-[#e4e2e1]">
                <span className="text-[10px] text-[#5c4037] uppercase font-bold block">Customer Tips</span>
                <span className="font-bold text-[#29695b]">₹660</span>
              </div>
            </div>
          </div>

          {/* Shift Telemetry & Vehicle Health */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-[#e4e2e1] space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="font-headline font-bold text-sm text-[#1b1c1c] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#a83300] text-[18px]">two_wheeler</span>
                <span>Rider Vehicle & Shift Telemetry</span>
              </h3>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                MH 15 AB 4592 (EV)
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
              <div className="p-3 bg-[#fcfaf9] rounded-2xl border border-[#e4e2e1]">
                <span className="text-[10px] text-[#5c4037] uppercase font-bold block">Active Shift</span>
                <span className="font-bold text-sm text-[#1b1c1c] block mt-0.5">4h 22m</span>
                <span className="text-[9px] text-gray-500">Since 08:30 AM</span>
              </div>

              <div className="p-3 bg-[#fcfaf9] rounded-2xl border border-[#e4e2e1]">
                <span className="text-[10px] text-[#5c4037] uppercase font-bold block">EV Battery</span>
                <span className="font-bold text-sm text-emerald-700 block mt-0.5">78% (~68 km)</span>
                <span className="text-[9px] text-emerald-600">Optimal Range</span>
              </div>

              <div className="p-3 bg-[#fcfaf9] rounded-2xl border border-[#e4e2e1]">
                <span className="text-[10px] text-[#5c4037] uppercase font-bold block">Distance Run</span>
                <span className="font-bold text-sm text-[#1b1c1c] block mt-0.5">34.2 km</span>
                <span className="text-[9px] text-gray-500">14 Trips Today</span>
              </div>

              <div className="p-3 bg-[#fcfaf9] rounded-2xl border border-[#e4e2e1]">
                <span className="text-[10px] text-[#5c4037] uppercase font-bold block">Green Carbon</span>
                <span className="font-bold text-sm text-[#29695b] block mt-0.5">4.8 kg CO₂</span>
                <span className="text-[9px] text-[#29695b]">Eco-Hero Badge</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Nashik Demand Hotspots & Surge Heatmap */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Nashik Live Demand Hotspot Zones Card */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-[#e4e2e1] space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-[#f0eded]">
              <div>
                <h3 className="font-headline font-bold text-sm text-[#1b1c1c] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#a83300] text-[18px]">local_fire_department</span>
                  <span>Nashik Surge Hotspots</span>
                </h3>
                <p className="text-[11px] text-[#5c4037]">High order frequency zones right now</p>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping shrink-0" title="Live Surge" />
            </div>

            <div className="space-y-2.5">
              {hotspotZones.map((zone) => {
                const isSelected = activeZone === zone.id;

                return (
                  <div
                    key={zone.id}
                    onClick={() => setActiveZone(zone.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#fff8f5] border-[#a83300] shadow-2xs ring-1 ring-[#a83300]/20'
                        : 'bg-[#fcfaf9] border-[#e4e2e1] hover:bg-white hover:border-[#ffdbd0]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-headline font-bold text-xs text-[#1b1c1c] truncate">
                            {zone.name}
                          </h4>
                          <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full border ${zone.surgeColor}`}>
                            {zone.surge}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#5c4037] mt-0.5">
                          {zone.distance} • {zone.activeOrders} orders waiting
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-bold text-xs text-[#29695b] block">
                          {zone.bonus}
                        </span>
                        <span className="text-[10px] text-gray-500">
                          {zone.avgWait} wait
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="mt-2.5 pt-2 border-t border-[#f0eded] flex items-center justify-between gap-2 text-xs">
                        <span className="text-[11px] text-[#a83300] font-semibold flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">near_me</span>
                          <span>High demand in College Rd Cafes</span>
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigateToTask();
                          }}
                          className="px-2.5 py-1 bg-[#a83300] hover:bg-[#d24200] text-white text-[11px] font-bold rounded-lg shadow-2xs transition-all active:scale-95"
                        >
                          Navigate Here
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 text-xs space-y-1">
              <span className="font-bold text-amber-900 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">bolt</span>
                <span>Peak Dinner Surge Starts at 7:00 PM</span>
              </span>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Earn 2.0x base fare per delivery across College Road & Gangapur Road between 7 PM - 11 PM.
              </p>
            </div>
          </div>

          {/* Quick Support & Dispatch Help */}
          <div className="p-4 bg-[#1b1c1c] text-white rounded-3xl shadow-sm flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="font-headline font-bold text-xs sm:text-sm block truncate">
                Need Route or Cash Support?
              </span>
              <p className="text-[11px] text-gray-300 truncate mt-0.5">
                Nashik Hub Fleet Desk: 1800-422-005
              </p>
            </div>
            <a
              href="tel:1800422005"
              className="px-3 py-1.5 bg-[#29695b] hover:bg-[#358372] text-white text-xs font-bold rounded-xl shrink-0 transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[15px]">call</span>
              <span>Call Hub</span>
            </a>
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* INSTANT UPI CASHOUT MODAL                                         */}
      {/* ================================================================ */}
      {cashoutModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in"
          onClick={() => setCashoutModalOpen(false)}
        >
          <div
            className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-5 sm:p-6 space-y-4 border border-[#e4e2e1] animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#e4e2e1] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">account_balance</span>
                </div>
                <div>
                  <h3 className="font-headline font-bold text-base text-[#1b1c1c]">Instant Rider Cashout</h3>
                  <p className="text-[11px] text-[#5c4037]">Direct transfer to verified UPI handle</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCashoutModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {cashoutSuccess ? (
              <div className="p-6 text-center space-y-2 animate-in zoom-in-90">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-[32px]">check</span>
                </div>
                <h4 className="font-headline font-bold text-lg text-[#1b1c1c]">₹{todayEarnings} Transferred!</h4>
                <p className="text-xs text-[#5c4037]">
                  Sent successfully to <strong>alex.nashik@okaxis</strong> via IMPS Instant Settlement.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCashout} className="space-y-4">
                <div className="p-3.5 bg-[#f6f3f2] rounded-2xl border border-[#e4e2e1] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#5c4037]">Available Balance</span>
                    <span className="font-headline font-bold text-2xl text-[#1b1c1c] block">
                      ₹{todayEarnings}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg">
                    Zero Surcharge
                  </span>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#1b1c1c]">
                    Receiving Bank UPI ID:
                  </label>
                  <div className="p-3 bg-[#fcfaf9] rounded-xl border border-[#e4e2e1] flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-[#1b1c1c]">alex.nashik@okaxis</span>
                    <span className="text-[10px] font-bold text-[#29695b] bg-emerald-50 px-2 py-0.5 rounded-full">
                      Verified
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setCashoutModalOpen(false)}
                    className="flex-1 py-3 border border-[#e4e2e1] text-[#5c4037] font-bold text-xs rounded-xl hover:bg-[#f6f3f2]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#29695b] hover:bg-[#1e5246] text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[17px]">bolt</span>
                    <span>Confirm & Withdraw</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

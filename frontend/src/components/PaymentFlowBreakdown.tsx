import React, { useState } from 'react';
import { Order } from '../types';

interface PaymentFlowBreakdownProps {
  orders: Order[];
  totalGMV: number;
  platformCommission: number;
}

interface PaymentChannel {
  id: 'upi' | 'cards' | 'cod' | 'refunds';
  name: string;
  subText: string;
  icon: string;
  color: string;
  bgLight: string;
  textColor: string;
  borderColor: string;
  percentage: number;
  volume: number;
  transactionsCount: number;
  successRate: string;
  avgLatency: string;
  popularMethods: string[];
  status: 'optimal' | 'warning' | 'neutral';
}

export const PaymentFlowBreakdown: React.FC<PaymentFlowBreakdownProps> = ({
  orders,
  totalGMV,
  platformCommission
}) => {
  const [timeRange, setTimeRange] = useState<'today' | '7d' | '30d'>('today');
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
  const [showLedgerModal, setShowLedgerModal] = useState(false);

  // Multipliers based on time range
  const multiplier = timeRange === 'today' ? 1 : timeRange === '7d' ? 5.8 : 22.4;
  const currentGMV = Math.round(totalGMV * (timeRange === 'today' ? 1 : multiplier));
  const currentCommission = Math.round(platformCommission * (timeRange === 'today' ? 1 : multiplier));

  // Compute stats for channels
  const channels: PaymentChannel[] = [
    {
      id: 'upi',
      name: 'UPI Direct (Instant)',
      subText: 'PhonePe, GPay, Paytm, BHIM & QR',
      icon: 'qr_code_scanner',
      color: '#29695b',
      bgLight: 'bg-emerald-50/70 hover:bg-emerald-50',
      textColor: 'text-[#29695b]',
      borderColor: 'border-emerald-200/80',
      percentage: 76,
      volume: Math.round(currentGMV * 0.76),
      transactionsCount: Math.max(orders.length, 1) * 18 * Math.round(multiplier),
      successRate: '99.8%',
      avgLatency: '0.9s',
      popularMethods: ['GPay', 'PhonePe', 'Paytm UPI', 'Cred'],
      status: 'optimal'
    },
    {
      id: 'cards',
      name: 'Cards & Netbanking',
      subText: 'Visa, RuPay, Mastercard & 50+ Banks',
      icon: 'credit_card',
      color: '#4f46e5',
      bgLight: 'bg-indigo-50/70 hover:bg-indigo-50',
      textColor: 'text-indigo-700',
      borderColor: 'border-indigo-200/80',
      percentage: 18,
      volume: Math.round(currentGMV * 0.18),
      transactionsCount: Math.max(orders.length, 1) * 4 * Math.round(multiplier),
      successRate: '98.9%',
      avgLatency: '2.3s',
      popularMethods: ['HDFC', 'SBI', 'ICICI', 'Axis'],
      status: 'optimal'
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      subText: 'OTP-verified cash collection on delivery',
      icon: 'payments',
      color: '#a83300',
      bgLight: 'bg-amber-50/70 hover:bg-amber-50',
      textColor: 'text-[#a83300]',
      borderColor: 'border-amber-200/80',
      percentage: 6,
      volume: Math.round(currentGMV * 0.06),
      transactionsCount: Math.max(orders.length, 1) * 2 * Math.round(multiplier),
      successRate: '99.4%',
      avgLatency: 'Verified OTP',
      popularMethods: ['Rider Cash Bag', 'QR at Doorstep'],
      status: 'optimal'
    }
  ];

  // Recent simulated payment logs for the drilldown modal
  const simulatedLedger = [
    {
      txId: 'TXN-982143',
      orderId: orders[0]?.orderNumber || 'BG-9021',
      restaurant: orders[0]?.restaurantName || 'The Spice Route',
      method: 'UPI (GPay)',
      icon: 'qr_code_scanner',
      amount: orders[0]?.total || 349,
      status: 'Captured & Settled',
      statusColor: 'text-emerald-700 bg-emerald-100',
      time: '2 mins ago',
      fee: '₹0.00 (Zero Gateway Surcharge)'
    },
    {
      txId: 'TXN-982142',
      orderId: 'BG-8942',
      restaurant: 'Nashik Misal House',
      method: 'UPI (PhonePe)',
      icon: 'qr_code_scanner',
      amount: 420,
      status: 'Captured & Settled',
      statusColor: 'text-emerald-700 bg-emerald-100',
      time: '14 mins ago',
      fee: '₹0.00'
    },
    {
      txId: 'TXN-982141',
      orderId: 'BG-8939',
      restaurant: 'Sadhana Chulivarchi Misal',
      method: 'Credit Card (HDFC)',
      icon: 'credit_card',
      amount: 890,
      status: 'Captured & Settled',
      statusColor: 'text-emerald-700 bg-emerald-100',
      time: '32 mins ago',
      fee: '₹14.24 (Merchant absorbed)'
    },
    {
      txId: 'TXN-982140',
      orderId: 'BG-8928',
      restaurant: 'Barbeque Nation Nashik',
      method: 'Cash on Delivery (OTP)',
      icon: 'payments',
      amount: 1240,
      status: 'OTP Verified & Handed to Rider',
      statusColor: 'text-blue-700 bg-blue-100',
      time: '48 mins ago',
      fee: '₹0.00'
    },
    {
      txId: 'TXN-982139',
      orderId: 'BG-8910',
      restaurant: 'Tibetan Kitchen Nashik',
      method: 'UPI (Paytm)',
      icon: 'qr_code_scanner',
      amount: 280,
      status: 'Captured & Settled',
      statusColor: 'text-emerald-700 bg-emerald-100',
      time: '1 hr ago',
      fee: '₹0.00'
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-[#e4e2e1] flex flex-col justify-between space-y-4">
      {/* Header with Title and Time Selector */}
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2.5 pb-2 border-b border-[#f0eded]">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#29695b] to-[#1e5246] text-white flex items-center justify-center shrink-0 shadow-2xs">
            <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
          </div>
          <div className="min-w-0">
            <h4 className="font-headline font-bold text-sm sm:text-base text-[#1b1c1c] flex items-center gap-1.5 truncate">
              <span>Payment Flow Breakdown</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" title="Gateway Live" />
            </h4>
            <p className="text-[11px] text-[#5c4037] truncate">
              Nashik Zone Gateway Settlements & SLA
            </p>
          </div>
        </div>

        {/* Time Filters */}
        <div className="flex items-center gap-1 self-start xs:self-auto bg-[#f6f3f2] p-1 rounded-xl border border-[#e4e2e1] shrink-0">
          {(['today', '7d', '30d'] as const).map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => setTimeRange(range)}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider transition-all ${
                timeRange === range
                  ? 'bg-white text-[#a83300] shadow-xs'
                  : 'text-[#5c4037] hover:text-[#1b1c1c]'
              }`}
            >
              {range === 'today' ? 'Today' : range === '7d' ? '7D' : '30D'}
            </button>
          ))}
        </div>
      </div>

      {/* Multi-Segment Stacked Visual Distribution Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-[11px] font-semibold text-[#5c4037]">
          <span className="flex items-center gap-1">
            <span className="font-bold text-[#1b1c1c]">Total Gateway Volume:</span>
            <span className="text-[#a83300] font-bold">₹{currentGMV.toLocaleString()}</span>
          </span>
          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.2 rounded-full">
            99.6% Avg SLA
          </span>
        </div>

        {/* Proportional Stacked Meter */}
        <div className="w-full h-3 rounded-full overflow-hidden flex bg-[#f0eded] shadow-inner p-0.5 gap-0.5">
          <div
            className="bg-[#29695b] hover:opacity-90 h-full rounded-l-full transition-all duration-500 relative group cursor-pointer"
            style={{ width: '76%' }}
            title={`UPI: 76% (₹${Math.round(currentGMV * 0.76).toLocaleString()})`}
          />
          <div
            className="bg-indigo-600 hover:opacity-90 h-full transition-all duration-500 cursor-pointer"
            style={{ width: '18%' }}
            title={`Cards: 18% (₹${Math.round(currentGMV * 0.18).toLocaleString()})`}
          />
          <div
            className="bg-[#a83300] hover:opacity-90 h-full rounded-r-full transition-all duration-500 cursor-pointer"
            style={{ width: '6%' }}
            title={`COD: 6% (₹${Math.round(currentGMV * 0.06).toLocaleString()})`}
          />
        </div>

        {/* Meter Legend */}
        <div className="flex items-center justify-between text-[10px] text-[#5c4037] font-medium pt-0.5 flex-wrap gap-1">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#29695b]" />
            <span>UPI (76%)</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-indigo-600" />
            <span>Cards (18%)</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#a83300]" />
            <span>COD (6%)</span>
          </span>
        </div>
      </div>

      {/* Responsive Payment Channels List */}
      <div className="space-y-2.5">
        {channels.map((channel) => {
          const isSelected = activeChannelId === channel.id;

          return (
            <div
              key={channel.id}
              onClick={() => setActiveChannelId(isSelected ? null : channel.id)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                channel.bgLight
              } ${
                isSelected
                  ? 'border-[#1b1c1c] shadow-xs ring-1 ring-[#1b1c1c]/10'
                  : channel.borderColor
              }`}
            >
              {/* Channel Primary Row */}
              <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-2xs"
                    style={{ backgroundColor: channel.color, color: '#ffffff' }}
                  >
                    <span className="material-symbols-outlined text-[17px]">{channel.icon}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-headline font-bold text-xs sm:text-sm text-[#1b1c1c]">
                        {channel.name}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-white/80 border border-black/5 text-[#5c4037]">
                        {channel.percentage}% Share
                      </span>
                    </div>
                    <p className="text-[11px] text-[#5c4037] truncate mt-0.5">
                      {channel.subText}
                    </p>
                  </div>
                </div>

                {/* Metrics Badges */}
                <div className="flex items-center justify-between xs:justify-end gap-2 shrink-0 pt-1 xs:pt-0 border-t xs:border-t-0 border-black/5">
                  <div className="text-left xs:text-right">
                    <span className="font-bold text-xs text-[#1b1c1c] block">
                      ₹{channel.volume.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-gray-500 block">
                      {channel.transactionsCount} txns
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-0.5 whitespace-nowrap">
                      <span className="material-symbols-outlined text-[12px]">check_circle</span>
                      {channel.successRate}
                    </span>
                    <span className="text-[9px] text-gray-500 mt-0.5 whitespace-nowrap">
                      {channel.avgLatency}
                    </span>
                  </div>
                </div>
              </div>

              {/* Collapsible / Micro Details on Tap */}
              {isSelected && (
                <div className="mt-2.5 pt-2.5 border-t border-black/5 flex flex-wrap items-center justify-between gap-2 text-[11px] animate-in fade-in duration-150">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] uppercase font-bold text-[#5c4037]">Top Rail:</span>
                    {channel.popularMethods.map((m) => (
                      <span
                        key={m}
                        className="px-1.5 py-0.5 bg-white rounded-md text-[10px] font-semibold text-[#1b1c1c] border border-black/5 shadow-2xs"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-[#29695b]">
                    ✓ Zero Settlement Latency
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Settlements & Disbursal Metrics Sub-Grid */}
      <div className="p-3 bg-[#fbf9f8] rounded-xl border border-[#e4e2e1] space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-bold text-[#1b1c1c] uppercase tracking-wider text-[10px] flex items-center gap-1">
            <span className="material-symbols-outlined text-[#29695b] text-[15px]">currency_rupee</span>
            Settlement Split
          </span>
          <span className="text-[10px] text-[#29695b] font-bold">Auto T+0 Daily Batch</span>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-white p-2 rounded-lg border border-[#e4e2e1]/80">
            <span className="text-[9px] text-[#5c4037] uppercase font-semibold block">Kitchens (82%)</span>
            <span className="font-bold text-[#1b1c1c] text-xs">
              ₹{Math.round(currentGMV * 0.82).toLocaleString()}
            </span>
          </div>
          <div className="bg-white p-2 rounded-lg border border-[#e4e2e1]/80">
            <span className="text-[9px] text-[#5c4037] uppercase font-semibold block">Commission (18%)</span>
            <span className="font-bold text-[#29695b] text-xs">
              ₹{currentCommission.toLocaleString()}
            </span>
          </div>
          <div className="bg-white p-2 rounded-lg border border-[#e4e2e1]/80">
            <span className="text-[9px] text-[#5c4037] uppercase font-semibold block">Dispute Rate</span>
            <span className="font-bold text-emerald-600 text-xs">0.02%</span>
          </div>
        </div>
      </div>

      {/* Action Footer to Drilldown into Transaction Ledger */}
      <div className="pt-1 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setShowLedgerModal(true)}
          className="w-full py-2 bg-gradient-to-r from-[#1b1c1c] to-[#2c2d2d] hover:from-black hover:to-black text-white text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1.5 active:scale-[0.99]"
        >
          <span className="material-symbols-outlined text-[16px]">receipt_long</span>
          <span>View Live Gateway Audit Logs ({simulatedLedger.length})</span>
        </button>
      </div>

      {/* Gateway Ledger Modal */}
      {showLedgerModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setShowLedgerModal(false)}
        >
          <div
            className="bg-white w-full max-w-xl max-h-[85vh] rounded-2xl shadow-2xl p-4 sm:p-5 flex flex-col space-y-4 border border-[#e4e2e1] animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#e4e2e1] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#29695b] text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                </div>
                <div>
                  <h3 className="font-headline font-bold text-base text-[#1b1c1c]">
                    Payment Gateway Audit Trail
                  </h3>
                  <p className="text-[11px] text-[#5c4037]">Real-time webhook capture & settlement ledger</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowLedgerModal(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {simulatedLedger.map((log) => (
                <div
                  key={log.txId}
                  className="p-3 bg-[#fbf9f8] hover:bg-white rounded-xl border border-[#e4e2e1] transition-all flex flex-col xs:flex-row xs:items-center justify-between gap-2.5"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[16px]">{log.icon}</span>
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-xs text-[#1b1c1c]">{log.txId}</span>
                        <span className="text-[10px] text-gray-500">• Order #{log.orderId}</span>
                      </div>
                      <p className="text-xs text-[#5c4037] truncate font-medium">{log.restaurant}</p>
                      <span className="text-[10px] text-gray-400">{log.method} • {log.time}</span>
                    </div>
                  </div>

                  <div className="text-left xs:text-right shrink-0 pt-1 xs:pt-0 border-t xs:border-t-0 border-gray-100">
                    <span className="font-bold text-sm text-[#1b1c1c] block">₹{log.amount}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${log.statusColor}`}>
                      {log.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#e4e2e1] flex items-center justify-between text-xs text-[#5c4037]">
              <span>Nashik Payment Gateway v2.4 Active</span>
              <button
                type="button"
                onClick={() => setShowLedgerModal(false)}
                className="px-4 py-2 bg-[#1b1c1c] text-white font-bold rounded-xl hover:bg-black transition-colors"
              >
                Close Audit Logs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

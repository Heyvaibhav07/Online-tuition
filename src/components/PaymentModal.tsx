/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  CreditCard, 
  ShieldCheck, 
  Lock, 
  Info, 
  CheckCircle,
  AlertCircle,
  Download,
  GraduationCap
} from 'lucide-react';
import { User, Payment } from '../types';

interface PaymentModalProps {
  user: User;
  onPaymentSuccess: (receipt: Payment) => void;
  onClose: () => void;
}

export default function PaymentModal({ user, onPaymentSuccess, onClose }: PaymentModalProps) {
  const [courseType, setCourseType] = useState('full');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [upiId, setUpiId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [receipt, setReceipt] = useState<Payment | null>(null);

  // Price parameters - set dynamically in Rupees by Teacher Neha Kumari
  const amount = user.monthlyFee || (courseType === 'full' ? 2500 : 1500);
  const courseText = courseType === 'full' 
    ? "Interactive Comprehensive School Suite (Mathematics, Science & Languages Semester)" 
    : "Standard Online Monthly Tuition (Aarambh Classes - Neha Kumari)";

  const handleChargeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Simulate minor client-side formatting checks
    if (paymentMethod === 'card') {
      if (!cardName || !cardNumber || !cardExpiry || !cardCVV) {
        setError('Please complete all premium credit card info inputs.');
        return;
      }
    } else {
      if (!upiId) {
        setError('Please complete your standard UPI transaction address.');
        return;
      }
    }

    setLoading(true);

    try {
      const response = await fetch('/api/payments/charge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: user.id,
          studentName: user.username,
          amount: amount,
          reason: `Course Enrollment: ${courseType === 'full' ? 'Physics, Mathematics, Chemistry' : user.chosenSubject || 'General Tuitions'}`,
          paymentMethod: paymentMethod === 'card' 
            ? `Credit Card: ${cardName} (•••• •••• •••• ${cardNumber.slice(-4) || '4242'})` 
            : `UPI Transaction: ${upiId}`
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Payment transaction declined.');
      }

      setReceipt(data.receipt);
      onPaymentSuccess(data.receipt);
    } catch (err: any) {
      setError(err.message || 'Payment server failed to respond.');
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerPrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden border border-gray-100 shadow-2xl flex flex-col">
        
        {/* Header Ribbon */}
        <div className="bg-indigo-600 text-white p-6 flex justify-between items-center">
          <div className="flex items-center space-x-2.5">
            <CreditCard className="h-6 w-6 text-indigo-200" />
            <div>
              <span className="text-[10px] bg-indigo-500 font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-md block w-fit">
                Gatekeeper Endpoint
              </span>
              <h2 className="text-lg font-bold tracking-tight block">Secure Course Enrollment</h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-white/60 hover:text-white font-semibold text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 md:p-8 flex-1 overflow-y-auto">
          {!receipt ? (
            <form onSubmit={handleChargeSubmit} className="space-y-6">
              
              {/* Sandbox info alerts */}
              <div className="bg-indigo-50 text-indigo-800 p-4 rounded-2xl border border-indigo-100 flex gap-2.5 items-start text-xs">
                <Info className="h-4.5 w-4.5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-indigo-900 block font-bold">Safe Sandbox Simulation Active:</strong>
                  Use any simulated credit card digits (e.g. 4242 x4) to immediately pre-test enrollment mechanics. This acts as a real validation pipeline.
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-700 text-xs font-semibold p-3 rounded-xl border border-red-100 flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Step 1: Select Tier */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Choose Enrollment Tier</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setCourseType('full')}
                    className={`p-4 border-2 rounded-2xl text-left transition-all relative cursor-pointer ${
                      courseType === 'full'
                        ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="block font-bold text-sm text-gray-900">Semester Pass</span>
                    <span className="block text-[11px] text-gray-500 mt-1 leading-normal">Unlocks Mathematics, Science & languages classes for full coaching.</span>
                    <div className="text-lg font-extrabold text-indigo-600 mt-3">₹ 2500 <span className="text-xs font-semibold text-gray-400">/ Semester</span></div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setCourseType('monthly')}
                    className={`p-4 border-2 rounded-2xl text-left transition-all relative cursor-pointer ${
                      courseType === 'monthly'
                        ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="block font-bold text-sm text-gray-900">Monthly Sub</span>
                    <span className="block text-[11px] text-gray-500 mt-1 leading-normal">Provides access to active assignments, schedules and 24/7 AI doubs.</span>
                    <div className="text-lg font-extrabold text-indigo-600 mt-3">₹ {amount} <span className="text-xs font-semibold text-gray-400">/ Month</span></div>
                  </button>
                </div>
              </div>

              {/* Step 2: Pay Channel Toggle */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Payment Method</label>
                <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`flex-1 py-1.5 rounded-lg text-center cursor-pointer ${
                      paymentMethod === 'card' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    Credit / Debit Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`flex-1 py-1.5 rounded-lg text-center cursor-pointer ${
                      paymentMethod === 'upi' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    UPI ID Transfer
                  </button>
                </div>
              </div>

              {/* Step 3: Fields */}
              {paymentMethod === 'card' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Name on Credit Card</label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="E.g., Vaibhav Raj"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none focus:border-indigo-500 font-medium text-gray-800"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="4242 4242 4242 4242"
                      maxLength={19}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none focus:border-indigo-500 font-mono tracking-widest text-gray-800"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">Expiry Date</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM / YY"
                        maxLength={5}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none focus:border-indigo-500 text-center text-gray-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">CVV / CVN</label>
                      <input
                        type="password"
                        value={cardCVV}
                        onChange={(e) => setCardCVV(e.target.value)}
                        placeholder="•••"
                        maxLength={3}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none focus:border-indigo-500 text-center text-gray-800"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">UPI Address (Virtual Payment ID)</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="E.g., user@okhdfc"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none focus:border-indigo-500 font-semibold tracking-wide text-gray-800"
                  />
                </div>
              )}

              {/* Gateway security assurance logo tag */}
              <div className="flex items-center space-x-2 text-[10px] text-gray-400 justify-center">
                <Lock className="h-3.5 w-3.5 text-indigo-500" />
                <span>Encrypted with standard SSL. Verification handled by mock Tuition API.</span>
              </div>

              {/* Charge trigger button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white font-bold text-sm py-3 px-4 rounded-xl hover:bg-indigo-700 transition duration-150 active:scale-95 disabled:opacity-40 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>{loading ? 'Processing through secure channels...' : `Confirm Enrollment - Pay ₹ ${amount}`}</span>
              </button>

            </form>
          ) : (
            // Success Receipt Page
            <div className="text-center py-6 space-y-6">
              <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto border-2 border-emerald-500">
                <CheckCircle className="h-10 w-10" />
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">Payment Successfully Completed!</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">Your permissions are updated. Your tuition program courses are fully unlocked.</p>
              </div>

              {/* Receipt Visual Sheet */}
              <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 text-left text-xs space-y-3 font-medium">
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <div className="flex items-center space-x-1">
                    <GraduationCap className="h-5 w-5 text-indigo-600" />
                    <span className="font-bold text-gray-800">Aarambh Classes Receipt</span>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono">ID: {receipt.id}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">Learner Name:</span>
                  <span className="text-gray-900 font-semibold">{receipt.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Allocated Course:</span>
                  <span className="text-gray-900 font-semibold text-right max-w-[200px] block">{courseText}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Channel:</span>
                  <span className="text-gray-900 font-mono text-[10px]">{receipt.paymentMethod}</span>
                </div>
                <div className="flex justify-between font-bold text-indigo-700 text-sm pt-2 border-t border-gray-200">
                  <span>Paid Amount:</span>
                  <span>₹ {receipt.amount}.00 INR</span>
                </div>
              </div>

              {/* Utility Print Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleTriggerPrint}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold py-2.5 px-4 text-xs transition active:scale-95 flex items-center justify-center space-x-1.5 cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  <span>Download receipt as PDF</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold py-2.5 px-4 text-xs transition active:scale-95 cursor-pointer"
                >
                  Return to Panel
                </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}

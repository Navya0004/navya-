/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, RefreshCw, Layers, History, ToggleLeft, ToggleRight, User, KeyRound, Check, FileText } from 'lucide-react';
import { LedgerLog } from '../types';

interface SettingsViewProps {
  logs: LedgerLog[];
  onClearLogs: () => void;
  onResetDatabase: () => void;
  userEmail: string;
  systemStatus: 'Operational' | 'Degraded' | 'Maintenance';
  setSystemStatus: (status: 'Operational' | 'Degraded' | 'Maintenance') => void;
  lowStockThreshold: number;
  setLowStockThreshold: (val: number) => void;
}

export default function SettingsView({
  logs,
  onClearLogs,
  onResetDatabase,
  userEmail,
  systemStatus,
  setSystemStatus,
  lowStockThreshold,
  setLowStockThreshold,
}: SettingsViewProps) {
  const [userName, setUserName] = useState('Navya Vuyyuru');
  const [role, setRole] = useState('Head of Operations');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Contextual Header */}
      <div className="mb-8">
        <h2 className="text-[#0b1c30] text-3xl font-extrabold tracking-tight">
          Control Panel
        </h2>
        <p className="text-[#464555] text-sm md:text-base mt-2">
          Configure security protocols, track validator node audits, and manage ledger variables.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Profile Card & Account Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-[#e5eeff] rounded-2xl p-6 shadow-xs">
            <h3 className="text-base font-bold text-[#0b1c30] mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-[#3525cd]" />
              Account Authority
            </h3>

            <div className="flex flex-col items-center text-center p-4 bg-[#f8f9ff] rounded-xl border border-[#e5eeff] mb-6">
              <div className="w-20 h-20 rounded-full border-2 border-[#3525cd] overflow-hidden p-0.5 bg-white mb-3">
                <img 
                  alt="User Profile" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-full" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHcSPm1-HXcl23_DSlzq5tJmZNLkF5lsZvHTUZQTVYjUF_XeDka23ZaKyWUn4lbn2zzkYdGMue2eKEgQsMaogBJempByFDCr_nVyrr1TM0E0QeSuYrV4ZiKMEcpb6NctgRsHFNNHjIU3dKkNqhwd2Yiu7paG08M-iaSY9Wuf2lrtSwfNPwG_vv-HIm6OxG9BeQbWv1U06YGaDGafAkp4B3ak3CDVj28jC82IucPakvgEidpltV2YVKlczWqYPa06s__tp_ju3tiLSO"
                />
              </div>
              <h4 className="font-bold text-[#0b1c30] text-sm">{userName}</h4>
              <p className="text-xs text-[#565e74] mt-0.5">{role}</p>
              <span className="mt-2 bg-[#dae2fd] text-[#3323cc] font-mono font-bold text-[9px] tracking-wider px-2 py-0.5 rounded-full uppercase">
                Node Coordinator
              </span>
            </div>

            <form onSubmit={handleProfileSave} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-[#777587] uppercase mb-1">Coordinator Name</label>
                <input 
                  type="text" 
                  value={userName} 
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f8f9ff] border border-[#c7c4d8]/60 text-[#0b1c30] rounded-lg text-xs font-medium outline-none focus:border-[#3525cd]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#777587] uppercase mb-1">Assigned Email</label>
                <input 
                  type="text" 
                  disabled
                  value={userEmail} 
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 text-[#777587] rounded-lg text-xs font-mono outline-none cursor-not-allowed"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full bg-[#3525cd] hover:bg-[#4f46e5] text-white py-2 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {savedSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Changes Appended!
                    </>
                  ) : (
                    "Save Coordinator Profile"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Node Operations Configuration */}
          <div className="bg-white border border-[#e5eeff] rounded-2xl p-6 shadow-xs">
            <h3 className="text-base font-bold text-[#0b1c30] mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#3525cd]" />
              System Variables
            </h3>

            <div className="space-y-4 text-xs">
              <div className="flex justify-between items-center pb-3 border-b border-[#f8f9ff]">
                <div>
                  <h4 className="font-bold text-[#0b1c30]">Validator Operations</h4>
                  <p className="text-[10px] text-[#777587] mt-0.5">Toggle live pipeline nodes</p>
                </div>
                <select
                  value={systemStatus}
                  onChange={(e) => setSystemStatus(e.target.value as any)}
                  className="bg-[#f8f9ff] border border-[#c7c4d8]/60 px-2 py-1 rounded text-xs font-semibold text-[#0b1c30]"
                >
                  <option value="Operational">Operational</option>
                  <option value="Degraded">Testing Mode</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>

              <div className="flex justify-between items-center pb-3 border-b border-[#f8f9ff]">
                <div>
                  <h4 className="font-bold text-[#0b1c30]">Low Stock Alert Limit</h4>
                  <p className="text-[10px] text-[#777587] mt-0.5">Low Stock badge trigger</p>
                </div>
                <input 
                  type="number" 
                  value={lowStockThreshold}
                  onChange={(e) => setLowStockThreshold(parseInt(e.target.value) || 15)}
                  className="w-16 px-2 py-1 bg-[#f8f9ff] border border-[#c7c4d8]/60 text-center font-mono font-bold text-xs rounded"
                />
              </div>

              {/* Maintenance triggers */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={onResetDatabase}
                  className="w-full border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset Inventory Stocks
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Ledger Activity logs */}
        <div className="lg:col-span-7 bg-white border border-[#e5eeff] rounded-2xl p-6 shadow-xs flex flex-col h-full justify-between">
          <div>
            <div className="flex justify-between items-center mb-4 border-b border-[#e5eeff] pb-3">
              <h3 className="text-base font-bold text-[#0b1c30] flex items-center gap-2">
                <History className="w-4 h-4 text-[#3525cd]" />
                Audited Block Activity Ledger
              </h3>
              {logs.length > 0 && (
                <button
                  onClick={onClearLogs}
                  className="text-[11px] font-bold text-[#ba1a1a] bg-transparent border-0 outline-none hover:underline cursor-pointer"
                >
                  Clear Logs
                </button>
              )}
            </div>

            {/* Logs List Container */}
            <div className="space-y-3 overflow-y-auto max-h-[360px] pr-1 scrollbar-thin">
              {logs.length === 0 ? (
                <div className="text-center p-12 bg-[#f8f9ff] rounded-xl border border-dashed border-[#c7c4d8]">
                  <FileText className="w-8 h-8 text-[#777587] mx-auto opacity-60 mb-2" />
                  <p className="text-xs font-bold text-[#565e74]">No ledger entries compiled</p>
                  <p className="text-[10px] text-[#777587] mt-1">
                    Book order reservations or release holds to generate cryptographically signed log files.
                  </p>
                </div>
              ) : (
                logs.map((log) => (
                  <div 
                    key={log.id}
                    className="p-3 bg-[#f8f9ff] hover:bg-[#e5eeff]/40 border border-[#e5eeff]/80 rounded-xl transition-all flex items-start gap-3 text-xs leading-normal"
                  >
                    <div className={`mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                      log.type === 'RESERVATION_CONFIRMED' 
                        ? 'bg-emerald-500' 
                        : log.type === 'CONFLICT_ERROR' 
                          ? 'bg-rose-500'
                          : log.type === 'RESERVATION_CANCELED' || log.type === 'STOCK_RELEASED'
                            ? 'bg-neutral-500'
                            : 'bg-indigo-500'
                    }`}></div>

                    <div className="flex-grow">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-[10px] font-bold text-[#3525cd]">
                          {log.type.replace('_', ' ')}
                        </span>
                        <span className="font-mono text-[9px] text-[#777587]">
                          {log.timestamp}
                        </span>
                      </div>
                      <p className="text-[#0b1c30] mt-1 font-medium">{log.message}</p>
                      {log.sku && (
                        <div className="mt-1 flex gap-2 font-mono text-[9px] uppercase font-bold text-[#777587] tracking-wider">
                          <span>SKU: {log.sku}</span>
                          <span>QTY: {log.qty.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ).reverse()}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#e5eeff] text-[#777587] text-[11px] leading-relaxed flex items-center justify-between">
            <span>Ledger state synced: <span className="font-bold text-emerald-600">Encrypted AES-256</span></span>
            <span className="font-mono">Nodes: 4 active</span>
          </div>
        </div>
      </div>
    </div>
  );
}

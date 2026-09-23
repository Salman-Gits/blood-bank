import React from "react";
import { Link } from "react-router-dom";
import { Droplet, Phone, MapPin, Mail, ShieldCheck, Heart, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer id="main-footer" className="bg-slate-900 text-slate-300 pt-14 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Col */}
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-xl tracking-tight">
              <span className="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-900/40">
                <Droplet className="w-5 h-5 fill-white text-white" />
              </span>
              <span>
                Blood<span className="text-red-500">Life</span> Network
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              A certified transfusion network connecting registered voluntary blood donors, patients, and healthcare facilities with verified medical standards.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-md border border-emerald-800/40 w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              24/7 Emergency Dispatch Center Active
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-red-400 transition-colors">
                  Home &amp; Emergency Hub
                </Link>
              </li>
              <li>
                <Link to="/find-donor" className="hover:text-red-400 transition-colors">
                  Find Verified Donors
                </Link>
              </li>
              <li>
                <Link to="/request-blood" className="hover:text-red-400 transition-colors">
                  Request Blood / Track Requisition
                </Link>
              </li>
              <li>
                <Link to="/admin/add-donor" className="hover:text-red-400 transition-colors">
                  Register as a Donor
                </Link>
              </li>
              <li>
                <Link to="/admin/dashboard" className="hover:text-red-400 transition-colors">
                  Hospital &amp; Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Blood Compatibility Guide */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Universal Donor Guide
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div className="p-2.5 rounded-lg bg-slate-800/70 border border-slate-700/60">
                <p className="font-semibold text-red-400">O Negative (O-)</p>
                <p className="text-slate-400 mt-0.5">Universal Red Cell Donor: can donate red blood cells to any recipient.</p>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-800/70 border border-slate-700/60">
                <p className="font-semibold text-blue-400">AB Positive (AB+)</p>
                <p className="text-slate-400 mt-0.5">Universal Recipient: can safely receive red blood cells of any blood type.</p>
              </div>
            </div>
          </div>

          {/* Emergency Helpline & Safety */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-4">
              Emergency Contact
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">Toll-Free Emergency Helpline</p>
                  <p className="font-bold text-white tracking-wide">1800-BLOOD-24 (1800-256-6324)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">Medical Liaison Office</p>
                  <p className="text-white">support@bloodbank.org</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-slate-400">Central Transfusion Registry</p>
                  <p className="text-white">Medical District, Regional Blood Center</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} BloodLife Medical Transfusion Network. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> NABH Certified Transfusion Protocol
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <Heart className="w-4 h-4 text-red-400" /> Voluntary Non-Remunerated Donations
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

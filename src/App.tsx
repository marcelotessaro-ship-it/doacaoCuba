import React, { useState, useEffect } from 'react';
import { User, Donation, ImpactReport, SystemStats } from './types';
import { INITIAL_USERS, INITIAL_DONATIONS, INITIAL_IMPACT_REPORTS } from './data/initialData';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { LoginView } from './components/LoginView';
import { RegisterView } from './components/RegisterView';
import { VisitorDashboard } from './components/VisitorDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { CubaRegionsDashboard } from './components/CubaRegionsDashboard';
import { DonationFlowModal } from './components/DonationFlowModal';

export default function App() {
  // Load state from localStorage if present
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('doacaocuba_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [donations, setDonations] = useState<Donation[]>(() => {
    const saved = localStorage.getItem('doacaocuba_donations');
    return saved ? JSON.parse(saved) : INITIAL_DONATIONS;
  });

  const [impactReports, setImpactReports] = useState<ImpactReport[]>(() => {
    const saved = localStorage.getItem('doacaocuba_impact_reports');
    return saved ? JSON.parse(saved) : INITIAL_IMPACT_REPORTS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('doacaocuba_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeView, setActiveView] = useState<'landing' | 'login' | 'register' | 'visitor_dashboard' | 'admin_dashboard' | 'cuba_regions'>('landing');
  const [isDonateModalOpen, setIsDonateModalOpen] = useState<boolean>(false);
  const [donateModalInitialAmount, setDonateModalInitialAmount] = useState<number>(5);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('doacaocuba_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('doacaocuba_donations', JSON.stringify(donations));
  }, [donations]);

  useEffect(() => {
    localStorage.setItem('doacaocuba_impact_reports', JSON.stringify(impactReports));
  }, [impactReports]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('doacaocuba_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('doacaocuba_current_user');
    }
  }, [currentUser]);

  // Compute System Statistics
  const totalAmountRaised = donations.reduce((acc, d) => acc + d.amount, 0);
  const totalDonorsCount = new Set(donations.map(d => d.donorEmail.toLowerCase())).size;
  const averageDonation = donations.length > 0 ? totalAmountRaised / donations.length : 0;
  const familiesSupported = impactReports.reduce((acc, r) => acc + r.familiesBenefited, 0) + Math.floor(donations.length * 2.5);

  const stats: SystemStats = {
    totalAmountRaised,
    totalDonors: Math.max(totalDonorsCount, 1420), // High impact display floor
    averageDonation,
    familiesSupported,
  };

  // Auth Handlers
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      setActiveView('admin_dashboard');
    } else {
      setActiveView('visitor_dashboard');
    }
  };

  const handleRegisterSuccess = (newUser: User) => {
    setUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    if (newUser.role === 'admin') {
      setActiveView('admin_dashboard');
    } else {
      setActiveView('visitor_dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveView('landing');
  };

  const handleOpenDonateModalWithAmount = (amount: number) => {
    setDonateModalInitialAmount(amount);
    setIsDonateModalOpen(true);
  };

  const handleDonationComplete = (newDonation: Donation) => {
    setDonations(prev => [newDonation, ...prev]);

    // If donor exists in user list, update user's totalDonated
    if (newDonation.donorEmail) {
      setUsers(prev =>
        prev.map(u => {
          if (u.email.toLowerCase() === newDonation.donorEmail.toLowerCase()) {
            return {
              ...u,
              totalDonated: u.totalDonated + newDonation.amount,
            };
          }
          return u;
        })
      );

      // If current logged-in user is the donor, update current state too
      if (currentUser && currentUser.email.toLowerCase() === newDonation.donorEmail.toLowerCase()) {
        setCurrentUser(prev => prev ? { ...prev, totalDonated: prev.totalDonated + newDonation.amount } : null);
      }
    }
  };

  const handleUpdateProfile = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    setCurrentUser(updatedUser);
  };

  const handleAddImpactReport = (newReport: ImpactReport) => {
    setImpactReports(prev => [newReport, ...prev]);
  };

  return (
    <div className="min-h-screen text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950 relative overflow-hidden">
      {/* Sleek Interface Ambient Background Glows */}
      <div className="fixed inset-0 opacity-20 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-emerald-500 blur-[140px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600 blur-[160px]"></div>
        <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(255,255,255,0.02) 40px, rgba(255,255,255,0.02) 41px)' }}></div>
      </div>

      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenDonateModal={() => setIsDonateModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Screen Router */}
      <main className="flex-1 relative z-10">
        {activeView === 'landing' && (
          <LandingPage
            stats={stats}
            impactReports={impactReports}
            onOpenDonateModalWithAmount={handleOpenDonateModalWithAmount}
            onNavigateLogin={() => setActiveView('login')}
            onNavigateRegister={() => setActiveView('register')}
            onNavigateRegions={() => setActiveView('cuba_regions')}
          />
        )}

        {activeView === 'login' && (
          <LoginView
            onLoginSuccess={handleLoginSuccess}
            onNavigateRegister={() => setActiveView('register')}
            allUsers={users}
          />
        )}

        {activeView === 'register' && (
          <RegisterView
            onRegisterSuccess={handleRegisterSuccess}
            onNavigateLogin={() => setActiveView('login')}
          />
        )}

        {activeView === 'cuba_regions' && (
          <CubaRegionsDashboard
            impactReports={impactReports}
            donations={donations}
            onOpenDonateModal={() => setIsDonateModalOpen(true)}
          />
        )}

        {activeView === 'visitor_dashboard' && currentUser && (
          <VisitorDashboard
            currentUser={currentUser}
            donations={donations}
            onOpenDonateModal={() => setIsDonateModalOpen(true)}
            onUpdateProfile={handleUpdateProfile}
          />
        )}

        {activeView === 'admin_dashboard' && currentUser && currentUser.role === 'admin' && (
          <AdminDashboard
            currentUser={currentUser}
            stats={stats}
            visitors={users}
            donations={donations}
            impactReports={impactReports}
            onAddImpactReport={handleAddImpactReport}
            onAddUser={newUser => setUsers(prev => [newUser, ...prev])}
          />
        )}
      </main>

      {/* Global Donation Flow Modal */}
      <DonationFlowModal
        isOpen={isDonateModalOpen}
        onClose={() => setIsDonateModalOpen(false)}
        currentUser={currentUser}
        initialAmount={donateModalInitialAmount}
        onDonationComplete={handleDonationComplete}
      />
    </div>
  );
}

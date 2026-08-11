import React, { useState } from 'react';
import { User, Donation, ImpactReport, SystemStats } from '../types';
import { 
  ShieldCheck, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Search, 
  Filter, 
  Plus, 
  CheckCircle2, 
  Calendar, 
  Receipt, 
  Download, 
  FileText, 
  Heart,
  Sparkles,
  MapPin,
  Clock,
  ArrowUpRight
} from 'lucide-react';

interface AdminDashboardProps {
  currentUser: User;
  stats: SystemStats;
  visitors: User[];
  donations: Donation[];
  impactReports: ImpactReport[];
  onAddImpactReport: (newReport: ImpactReport) => void;
  onAddUser?: (newUser: User) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  stats,
  visitors,
  donations,
  impactReports,
  onAddImpactReport,
  onAddUser,
}) => {
  const [activeTab, setActiveTab] = useState<'donations' | 'visitors' | 'transparency'>('donations');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  // New Impact Report Form Modal
  const [showAddReportModal, setShowAddReportModal] = useState(false);
  const [reportTitle, setReportTitle] = useState('');
  const [reportDesc, setReportDesc] = useState('');
  const [reportLocation, setReportLocation] = useState('Havana, Cuba');
  const [reportAmountSpent, setReportAmountSpent] = useState('');
  const [reportFamilies, setReportFamilies] = useState('');

  // New Admin User Modal
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPhone, setAdminPhone] = useState('');
  const [adminSuccessMsg, setAdminSuccessMsg] = useState('');

  // Filtered Donations
  const filteredDonations = donations.filter(d => {
    const matchesSearch = 
      d.donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.donorEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'todos' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered Visitors
  const filteredVisitors = visitors.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle || !reportDesc) return;

    const newReport: ImpactReport = {
      id: `IMP-0${impactReports.length + 1}`,
      title: reportTitle.trim(),
      description: reportDesc.trim(),
      location: reportLocation || 'La Habana, Cuba',
      date: new Date().toISOString().split('T')[0],
      amountSpent: parseFloat(reportAmountSpent) || 5000,
      familiesBenefited: parseInt(reportFamilies) || 50,
      category: 'alimentos',
      status: 'entregue',
    };

    onAddImpactReport(newReport);
    setShowAddReportModal(false);
    setReportTitle('');
    setReportDesc('');
  };

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminName || !adminEmail) return;

    const newAdmin: User = {
      id: `user-admin-${Date.now()}`,
      name: adminName.trim(),
      email: adminEmail.trim(),
      role: 'admin',
      cpf: '000.000.000-00',
      address: 'Sede Administrativa - doacaoCuba',
      phone: adminPhone || undefined,
      country: 'Brasil',
      createdAt: new Date().toISOString(),
      totalDonated: 0,
    };

    if (onAddUser) {
      onAddUser(newAdmin);
    }
    setAdminSuccessMsg(`Usuário Administrador "${adminName}" criado com sucesso!`);
    setTimeout(() => {
      setShowAddAdminModal(false);
      setAdminSuccessMsg('');
      setAdminName('');
      setAdminEmail('');
      setAdminPhone('');
    }, 1500);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] cuba-decay-bg cuba-decay-texture p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* TOP ADMIN HEADER */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white">Painel Administrativo doaçãoCuba</h1>
                <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  Modo Geral
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-0.5">
                Acesso Restrito • Gestão de Visitantes, Doações e Relatórios de Transparência
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
            <button
              onClick={() => setShowAddAdminModal(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-300 font-bold text-xs transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Criar Administrador</span>
            </button>

            <button
              onClick={() => setShowAddReportModal(true)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-bold text-xs hover:scale-105 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Relatório de Entrega</span>
            </button>
          </div>
        </div>

        {/* INDICADORES GERAIS NO TOPO (Requisito explícito) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-6 rounded-3xl border border-emerald-500/30">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Total Arrecadado</div>
            <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-300">
              R$ {stats.totalAmountRaised.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> Atualizado em tempo real
            </div>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-cyan-500/30">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Número de Doadores</div>
            <div className="text-3xl font-black text-white">
              {stats.totalDonors.toLocaleString('pt-BR')}
            </div>
            <div className="text-[11px] text-slate-400 mt-2">Perfis cadastrados e anônimos</div>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-amber-500/30">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Doação Média</div>
            <div className="text-3xl font-black text-amber-300">
              R$ {stats.averageDonation.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-slate-400 mt-2">Valor médio por transação</div>
          </div>

          <div className="glass-card p-6 rounded-3xl border border-teal-500/30">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Famílias Ajudadas</div>
            <div className="text-3xl font-black text-emerald-400">
              {stats.familiesSupported.toLocaleString('pt-BR')}
            </div>
            <div className="text-[11px] text-slate-400 mt-2">Beneficiados em Cuba</div>
          </div>
        </div>

        {/* TABS NAVIGATION */}
        <div className="glass-panel p-2 rounded-2xl border border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('donations')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'donations'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Histórico de Doações ({donations.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('visitors')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'visitors'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Perfis de Visitantes ({visitors.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('transparency')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'transparency'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Gestão de Transparência ({impactReports.length})</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nome, email ou ID..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl glass-input text-xs text-white placeholder-slate-500"
            />
          </div>
        </div>

        {/* TAB 1: DOAÇÕES RECEBIDAS */}
        {activeTab === 'donations' && (
          <div className="glass-panel p-6 rounded-3xl border border-emerald-500/20 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">Todas as Doações Recebidas</h2>
                <p className="text-slate-400 text-xs">Acompanhamento detalhado com CPF e endereço completo dos doadores.</p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2 text-xs">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400">Filtrar:</span>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="bg-slate-900 text-slate-200 border border-white/10 rounded-lg px-3 py-1.5 focus:outline-none"
                >
                  <option value="todos">Todos os Status</option>
                  <option value="concluido">Concluído</option>
                  <option value="pendente">Pendente</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[10px] border-b border-white/10">
                  <tr>
                    <th className="p-3.5">ID Transação</th>
                    <th className="p-3.5">Dados do Doador (Nome & CPF)</th>
                    <th className="p-3.5">Endereço Completo</th>
                    <th className="p-3.5">Valor</th>
                    <th className="p-3.5">Método</th>
                    <th className="p-3.5">Data</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {filteredDonations.map((d) => (
                    <tr key={d.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-3.5 font-bold text-emerald-400">{d.id}</td>
                      <td className="p-3.5 font-sans">
                        <div className="font-bold text-white">{d.donorName}</div>
                        <div className="text-[11px] text-emerald-400 font-mono">CPF: {d.donorCpf || '***.***.***-**'}</div>
                        <div className="text-[11px] text-slate-400">{d.donorEmail}</div>
                      </td>
                      <td className="p-3.5 font-sans text-[11px] text-slate-300 max-w-[240px]">
                        {d.donorStreet ? (
                          <div className="space-y-0.5">
                            <div className="font-medium text-white">{d.donorStreet}, {d.donorNumber || 'S/N'}</div>
                            <div className="text-slate-400 text-[10px]">{d.donorNeighborhood} • {d.donorCity}/{d.donorStateUf}</div>
                            <div className="text-slate-500 text-[10px] font-mono">CEP: {d.donorCep}</div>
                          </div>
                        ) : (
                          d.donorAddress || 'Não informado'
                        )}
                      </td>
                      <td className="p-3.5 font-bold text-emerald-300 text-sm">
                        R$ {d.amount.toFixed(2)}
                      </td>
                      <td className="p-3.5 font-sans uppercase text-[11px] text-cyan-300">
                        {d.paymentMethod}
                      </td>
                      <td className="p-3.5 font-sans text-slate-400">
                        {new Date(d.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="p-3.5 font-sans">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-[10px] border border-emerald-500/20">
                          {d.status === 'concluido' ? 'Concluído' : d.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: VISITANTES CADASTRADOS */}
        {activeTab === 'visitors' && (
          <div className="glass-panel p-6 rounded-3xl border border-emerald-500/20 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Usuários e Visitantes Cadastrados</h2>
                <p className="text-slate-400 text-xs">Lista de usuários contendo dados cadastrais obrigatórios (CPF e Endereço).</p>
              </div>

              <button
                onClick={() => setShowAddAdminModal(true)}
                className="px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs hover:bg-amber-500/30 transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Novo Administrador</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[10px] border-b border-white/10">
                  <tr>
                    <th className="p-3.5">Nome / CPF</th>
                    <th className="p-3.5">E-mail</th>
                    <th className="p-3.5">Endereço Completo</th>
                    <th className="p-3.5">Função</th>
                    <th className="p-3.5">Cadastro</th>
                    <th className="p-3.5">Total Doado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredVisitors.map((v) => (
                    <tr key={v.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-white">{v.name}</div>
                        <div className="text-[11px] font-mono text-emerald-400">CPF: {v.cpf || 'Não cadastrado'}</div>
                      </td>
                      <td className="p-3.5 font-mono text-slate-300">{v.email}</td>
                      <td className="p-3.5 text-slate-300 max-w-[240px] text-[11px]">
                        {v.street ? (
                          <div className="space-y-0.5">
                            <div className="font-medium text-white">{v.street}, {v.number || 'S/N'}</div>
                            <div className="text-slate-400 text-[10px]">{v.neighborhood} • {v.city}/{v.stateUf}</div>
                            <div className="text-slate-500 text-[10px] font-mono">CEP: {v.cep}</div>
                          </div>
                        ) : (
                          v.address || 'Não cadastrado'
                        )}
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          v.role === 'admin' 
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {v.role}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-400">
                        {new Date(v.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="p-3.5 font-bold text-emerald-300 font-mono">
                        R$ {v.totalDonated.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: GESTÃO DE TRANSPARÊNCIA */}
        {activeTab === 'transparency' && (
          <div className="glass-panel p-6 rounded-3xl border border-emerald-500/20 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">Relatórios de Impacto e Transparência</h2>
                <p className="text-slate-400 text-xs">Ações humanitárias publicadas e visíveis aos doadores.</p>
              </div>

              <button
                onClick={() => setShowAddReportModal(true)}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Ação</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {impactReports.map((report) => (
                <div key={report.id} className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-emerald-400">{report.id}</span>
                    <span className="text-slate-400">{report.date}</span>
                  </div>
                  <h4 className="font-bold text-white text-sm">{report.title}</h4>
                  <p className="text-slate-300 text-xs leading-relaxed">{report.description}</p>
                  <div className="pt-3 border-t border-white/10 text-[11px] text-slate-400 flex justify-between font-mono">
                    <span>Investimento: R$ {report.amountSpent.toFixed(2)}</span>
                    <span className="text-emerald-400">{report.familiesBenefited} famílias</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* NEW IMPACT REPORT MODAL */}
      {showAddReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel p-8 rounded-3xl border border-emerald-500/30 max-w-lg w-full space-y-6 relative">
            <button
              onClick={() => setShowAddReportModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">Cadastrar Novo Relatório de Impacto</h3>
              <p className="text-slate-400 text-xs">Publique uma prestação de contas do envio de ajuda a Cuba.</p>
            </div>

            <form onSubmit={handleCreateReport} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Título da Ação *</label>
                <input
                  type="text"
                  placeholder="Ex.: Entrega de 200 Cestas de Alimentos em Camagüey"
                  value={reportTitle}
                  onChange={e => setReportTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-xs text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Descrição do Impacto *</label>
                <textarea
                  placeholder="Detalhamento dos insumos distribuídos e situação das famílias atendidas..."
                  value={reportDesc}
                  onChange={e => setReportDesc(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-xs text-white h-24"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Localização</label>
                  <input
                    type="text"
                    value={reportLocation}
                    onChange={e => setReportLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Famílias Atendidas</label>
                  <input
                    type="number"
                    placeholder="100"
                    value={reportFamilies}
                    onChange={e => setReportFamilies(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Valor Total Investido (R$)</label>
                <input
                  type="number"
                  placeholder="8500"
                  value={reportAmountSpent}
                  onChange={e => setReportAmountSpent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold text-xs hover:scale-[1.01] transition-all"
              >
                Publicar Relatório de Transparência
              </button>
            </form>
          </div>
        </div>
      )}

      {/* NEW ADMIN USER MODAL */}
      {showAddAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel p-8 rounded-3xl border border-amber-500/30 max-w-md w-full space-y-6 relative">
            <button
              onClick={() => setShowAddAdminModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <div className="space-y-1">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-2">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white">Criar Usuário Administrador</h3>
              <p className="text-slate-400 text-xs">Cadastre um novo perfil de gestor com privilégios administrativos.</p>
            </div>

            {adminSuccessMsg ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{adminSuccessMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleCreateAdmin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    placeholder="Ex.: Fernando Henrique Soares"
                    value={adminName}
                    onChange={e => setAdminName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-xs text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">E-mail Institucional / Pessoal *</label>
                  <input
                    type="email"
                    placeholder="admin2@doacaocuba.org"
                    value={adminEmail}
                    onChange={e => setAdminEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-xs text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Telefone / WhatsApp (Opcional)</label>
                  <input
                    type="tel"
                    placeholder="+55 (11) 98888-7777"
                    value={adminPhone}
                    onChange={e => setAdminPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-xs text-white"
                  />
                </div>

                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 leading-relaxed">
                  Este usuário terá perfil <strong>Administrador (admin)</strong> e poderá acessar todos os dados de arrecadação, gerenciar usuários e publicar relatórios de transparência.
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 text-slate-950 font-bold text-xs hover:scale-[1.01] transition-all"
                >
                  Confirmar e Criar Administrador
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

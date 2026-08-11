import React, { useState } from 'react';
import { ImpactReport, Donation } from '../types';
import {
  MapPin,
  TrendingUp,
  PackageCheck,
  Heart,
  ShieldCheck,
  Layers,
  Search,
  Zap,
  Pill,
  Utensils,
  DollarSign,
  CheckCircle2,
  ArrowRight,
  Filter,
  Sparkles,
  Globe2,
  Activity,
  FileText,
  Building2,
  Users
} from 'lucide-react';

interface CubaRegionsDashboardProps {
  impactReports: ImpactReport[];
  donations: Donation[];
  onOpenDonateModal: () => void;
}

export interface CubaProvinceData {
  id: string;
  name: string;
  code: string;
  zone: 'Occidente' | 'Centro' | 'Oriente' | 'Isla';
  totalAllocated: number;
  familiesBenefited: number;
  deliveriesCount: number;
  urgencyLevel: 'Crítica' | 'Alta' | 'Média';
  status: 'Entregas Ativas' | 'Envio em Trânsito' | 'Próximo Lote';
  primaryNeed: string;
  categories: {
    alimentos: number; // percentage
    medicamentos: number;
    energia: number;
    apoio_direto: number;
  };
  coordinates: { x: number; y: number }; // Relative position on interactive map
  recentLog: string;
}

const CUBA_PROVINCES: CubaProvinceData[] = [
  {
    id: 'habana',
    name: 'La Habana',
    code: 'LHA',
    zone: 'Occidente',
    totalAllocated: 18500.0,
    familiesBenefited: 420,
    deliveriesCount: 8,
    urgencyLevel: 'Crítica',
    status: 'Entregas Ativas',
    primaryNeed: 'Cestas básicas alimentícias e leite em pó para crianças',
    categories: { alimentos: 50, medicamentos: 30, energia: 10, apoio_direto: 10 },
    coordinates: { x: 28, y: 25 },
    recentLog: '180 Cestas básicas de emergência distribuídas em Habana Vieja e Cerro.'
  },
  {
    id: 'santiago',
    name: 'Santiago de Cuba',
    code: 'SCU',
    zone: 'Oriente',
    totalAllocated: 14200.0,
    familiesBenefited: 310,
    deliveriesCount: 6,
    urgencyLevel: 'Crítica',
    status: 'Entregas Ativas',
    primaryNeed: 'Antibióticos, insulina e suprimentos hospitalares emergenciais',
    categories: { alimentos: 30, medicamentos: 55, energia: 10, apoio_direto: 5 },
    coordinates: { x: 82, y: 72 },
    recentLog: 'Lote emergencial com 400 frascos de insulina e antibióticos entregue no Hospital Infantil.'
  },
  {
    id: 'pinar',
    name: 'Pinar del Río',
    code: 'PRI',
    zone: 'Occidente',
    totalAllocated: 11800.0,
    familiesBenefited: 240,
    deliveriesCount: 5,
    urgencyLevel: 'Crítica',
    status: 'Entregas Ativas',
    primaryNeed: 'Painéis solares comunitários, lâmpadas recarregáveis e telhas pós-furacão',
    categories: { alimentos: 25, medicamentos: 20, energia: 45, apoio_direto: 10 },
    coordinates: { x: 12, y: 35 },
    recentLog: 'Instalação de 3 hubs de energia solar para apoio nos apagões de 20 horas.'
  },
  {
    id: 'holguin',
    name: 'Holguín',
    code: 'HOL',
    zone: 'Oriente',
    totalAllocated: 9600.0,
    familiesBenefited: 210,
    deliveriesCount: 4,
    urgencyLevel: 'Alta',
    status: 'Envio em Trânsito',
    primaryNeed: 'Insumos médicos para pediatria e filtros de purificação de água',
    categories: { alimentos: 35, medicamentos: 45, energia: 10, apoio_direto: 10 },
    coordinates: { x: 74, y: 55 },
    recentLog: 'Carga com 150 filtros de água potável em rota de transporte rodoviário local.'
  },
  {
    id: 'villaclara',
    name: 'Villa Clara (Santa Clara)',
    code: 'VCL',
    zone: 'Centro',
    totalAllocated: 8400.0,
    familiesBenefited: 185,
    deliveriesCount: 4,
    urgencyLevel: 'Alta',
    status: 'Entregas Ativas',
    primaryNeed: 'Kits geriátricos e suplementação alimentar para idosos',
    categories: { alimentos: 40, medicamentos: 35, energia: 15, apoio_direto: 10 },
    coordinates: { x: 45, y: 40 },
    recentLog: 'Entrega de suplementos proteicos para 85 asilos e lares comunitários de idosos.'
  },
  {
    id: 'camaguey',
    name: 'Camagüey',
    code: 'CMG',
    zone: 'Centro',
    totalAllocated: 7200.0,
    familiesBenefited: 160,
    deliveriesCount: 3,
    urgencyLevel: 'Alta',
    status: 'Entregas Ativas',
    primaryNeed: 'Apoio logístico para pequenos agricultores e grãos',
    categories: { alimentos: 60, medicamentos: 20, energia: 10, apoio_direto: 10 },
    coordinates: { x: 62, y: 52 },
    recentLog: 'Distribuição direta de sacos de arroz, feijão preto e fubá em zonas rurais.'
  },
  {
    id: 'matanzas',
    name: 'Matanzas',
    code: 'MTZ',
    zone: 'Occidente',
    totalAllocated: 6800.0,
    familiesBenefited: 140,
    deliveriesCount: 3,
    urgencyLevel: 'Média',
    status: 'Entregas Ativas',
    primaryNeed: 'Apoio a famílias de pescadores e medicação analgésica/cardíaca',
    categories: { alimentos: 45, medicamentos: 35, energia: 10, apoio_direto: 10 },
    coordinates: { x: 35, y: 32 },
    recentLog: 'Doação de 90 kits de primeiros socorros e alimentos secos em Cárdenas.'
  },
  {
    id: 'cienfuegos',
    name: 'Cienfuegos',
    code: 'CFG',
    zone: 'Centro',
    totalAllocated: 5900.0,
    familiesBenefited: 125,
    deliveriesCount: 3,
    urgencyLevel: 'Média',
    status: 'Próximo Lote',
    primaryNeed: 'Equipamentos de lanterna LED solares e kits maternos',
    categories: { alimentos: 35, medicamentos: 30, energia: 25, apoio_direto: 10 },
    coordinates: { x: 42, y: 48 },
    recentLog: 'Pré-agendado envio de 100 lâmpadas LED recarregáveis para recém-nascidos.'
  },
  {
    id: 'granma',
    name: 'Granma (Bayamo / Manzanillo)',
    code: 'GRM',
    zone: 'Oriente',
    totalAllocated: 5400.0,
    familiesBenefited: 115,
    deliveriesCount: 2,
    urgencyLevel: 'Alta',
    status: 'Entregas Ativas',
    primaryNeed: 'Cestas rurais de subsistência e remédios antitérmicos',
    categories: { alimentos: 50, medicamentos: 35, energia: 10, apoio_direto: 5 },
    coordinates: { x: 72, y: 68 },
    recentLog: 'Ajuda emergencial em Manzanillo com cestas alimentares entregues diretamente.'
  },
  {
    id: 'guantanamo',
    name: 'Guantánamo',
    code: 'GTM',
    zone: 'Oriente',
    totalAllocated: 4900.0,
    familiesBenefited: 105,
    deliveriesCount: 2,
    urgencyLevel: 'Crítica',
    status: 'Envio em Trânsito',
    primaryNeed: 'Reconstrução comunitária, lanternas e filtros de água',
    categories: { alimentos: 35, medicamentos: 25, energia: 30, apoio_direto: 10 },
    coordinates: { x: 90, y: 68 },
    recentLog: 'Lote suplementar em trânsito pela cordilheira oriental para Baracoa.'
  },
  {
    id: 'sancti',
    name: 'Sancti Spíritus',
    code: 'SSP',
    zone: 'Centro',
    totalAllocated: 4200.0,
    familiesBenefited: 90,
    deliveriesCount: 2,
    urgencyLevel: 'Média',
    status: 'Entregas Ativas',
    primaryNeed: 'Remédios para pressão alta, diabetes e farinha de trigo',
    categories: { alimentos: 45, medicamentos: 40, energia: 10, apoio_direto: 5 },
    coordinates: { x: 50, y: 48 },
    recentLog: 'Remessa enviada para Trinidad e Sancti Spíritus com medicação crônica.'
  },
  {
    id: 'isla',
    name: 'Isla de la Juventud',
    code: 'IJU',
    zone: 'Isla',
    totalAllocated: 3800.0,
    familiesBenefited: 80,
    deliveriesCount: 2,
    urgencyLevel: 'Alta',
    status: 'Próximo Lote',
    primaryNeed: 'Logística marítima especial de alimentos não perecíveis',
    categories: { alimentos: 55, medicamentos: 25, energia: 10, apoio_direto: 10 },
    coordinates: { x: 22, y: 58 },
    recentLog: 'Embarque marítimo especial organizado no porto de Batabanó com alimentos.'
  }
];

export const CubaRegionsDashboard: React.FC<CubaRegionsDashboardProps> = ({
  impactReports,
  donations,
  onOpenDonateModal,
}) => {
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>('habana');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [zoneFilter, setZoneFilter] = useState<'Todas' | 'Occidente' | 'Centro' | 'Oriente' | 'Isla'>('Todas');

  // Compute live dynamic totals
  const totalSystemRaised = donations.reduce((sum, d) => sum + d.amount, 0);
  const totalBaseAllocated = CUBA_PROVINCES.reduce((sum, p) => sum + p.totalAllocated, 0);
  const totalAllocatedAll = totalBaseAllocated + totalSystemRaised;

  const totalFamilies = CUBA_PROVINCES.reduce((sum, p) => sum + p.familiesBenefited, 0) + Math.floor(donations.length * 2);

  const selectedProvince = CUBA_PROVINCES.find(p => p.id === selectedProvinceId) || CUBA_PROVINCES[0];

  const filteredProvinces = CUBA_PROVINCES.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.primaryNeed.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesZone = zoneFilter === 'Todas' || p.zone === zoneFilter;
    return matchesSearch && matchesZone;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/40 border border-emerald-500/20 p-6 sm:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <Globe2 className="w-4 h-4" />
              <span>Mapa Interativo & Transparência Geográfica</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Distribuição Regional dos Recursos em <span className="text-emerald-400">Cuba</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Acompanhe em tempo real como cada real doado é convertido em cestas básicas, medicamentos vitais e equipamentos de energia solar em cada uma das províncias cubanas.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={onOpenDonateModal}
              className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4 fill-slate-950/40" />
              <span>Doe Para as Regiões</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Distribuído em Cuba</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">
            R$ {totalAllocatedAll.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>100% Auditado em recibos públicos</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Províncias Atendidas</span>
            <MapPin className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-black text-white">
            15 de 15 <span className="text-xs font-normal text-slate-400">(100% Cobertura)</span>
          </div>
          <div className="text-[11px] text-teal-300 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Rotas logísticas ativas em todas zonas</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Famílias Beneficiadas</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {totalFamilies.toLocaleString('pt-BR')} <span className="text-xs font-normal text-slate-400">famílias</span>
          </div>
          <div className="text-[11px] text-blue-300 font-medium flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Média de 4.2 pessoas por lar</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Entrega Direta (Sem Burocracia)</span>
            <ShieldCheck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">
            94.8% <span className="text-xs font-normal text-slate-400">eficiência</span>
          </div>
          <div className="text-[11px] text-amber-300 font-medium flex items-center gap-1">
            <PackageCheck className="w-3.5 h-3.5" />
            <span>Apoio através de igrejas e voluntários</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Map & Region Selector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Map Visualizer & Province List (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Interactive Cuba Map Box */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-white/10 backdrop-blur-xl space-y-4 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-400" />
                  <span>Mapa Visual de Distribuição</span>
                </h2>
                <p className="text-xs text-slate-400">Selecione uma província no mapa ou na lista abaixo para inspecionar</p>
              </div>

              {/* Zone Filter Pill Selector */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-800/80 border border-white/10 text-xs">
                {(['Todas', 'Occidente', 'Centro', 'Oriente', 'Isla'] as const).map(z => (
                  <button
                    key={z}
                    onClick={() => setZoneFilter(z)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                      zoneFilter === z
                        ? 'bg-emerald-500 text-slate-950 shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {z}
                  </button>
                ))}
              </div>
            </div>

            {/* Stylized Interactive Map Stage */}
            <div className="relative w-full h-64 sm:h-72 rounded-2xl bg-slate-950/80 border border-white/5 p-4 flex items-center justify-center overflow-hidden group">
              {/* Grid backdrop */}
              <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none"></div>

              {/* Stylized Island Outline (Stylized SVG representation of Cuba) */}
              <svg viewBox="0 0 100 80" className="w-full h-full text-slate-800 fill-slate-800/40 stroke-emerald-500/30 stroke-[0.5]">
                {/* Main Island shape path */}
                <path d="M 8,32 C 15,22 28,20 38,28 C 45,30 52,42 62,48 C 72,50 82,55 92,62 C 95,68 88,75 78,72 C 68,68 58,58 48,50 C 38,45 28,38 18,40 C 12,42 6,38 8,32 Z" />
                {/* Isla de la Juventud */}
                <circle cx="22" cy="58" r="4" />
              </svg>

              {/* Interactive Province Hotspot Pins */}
              {CUBA_PROVINCES.map((prov) => {
                const isSelected = prov.id === selectedProvinceId;
                const isFilteredOut = zoneFilter !== 'Todas' && prov.zone !== zoneFilter;

                if (isFilteredOut) return null;

                return (
                  <button
                    key={prov.id}
                    onClick={() => setSelectedProvinceId(prov.id)}
                    style={{ left: `${prov.coordinates.x}%`, top: `${prov.coordinates.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 group/pin transition-all duration-300 z-20 ${
                      isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                    }`}
                  >
                    {/* Pulse ring for critical urgency */}
                    {prov.urgencyLevel === 'Crítica' && (
                      <span className="absolute -inset-1 rounded-full bg-rose-500/40 animate-ping pointer-events-none"></span>
                    )}

                    <div className={`px-2 py-1 rounded-full text-[10px] font-bold font-mono border flex items-center gap-1 shadow-lg backdrop-blur-md transition-all ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 border-emerald-300 shadow-emerald-500/40 scale-110'
                        : prov.urgencyLevel === 'Crítica'
                        ? 'bg-rose-950/80 text-rose-300 border-rose-500/50'
                        : 'bg-slate-900/90 text-slate-200 border-white/20 hover:border-emerald-400'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      <span>{prov.code}</span>
                    </div>

                    {/* Hover Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/pin:block w-40 p-2 rounded-xl bg-slate-900 text-white text-[11px] shadow-2xl border border-white/20 z-50 pointer-events-none">
                      <div className="font-bold">{prov.name}</div>
                      <div className="text-emerald-400 text-[10px]">R$ {prov.totalAllocated.toLocaleString('pt-BR')}</div>
                      <div className="text-slate-400 text-[9px]">{prov.familiesBenefited} famílias</div>
                    </div>
                  </button>
                );
              })}

              <div className="absolute bottom-3 right-3 text-[10px] text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-2">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span> Crítica</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Alta</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Média</span>
              </div>
            </div>

            {/* Search and Province Filter Bar */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por província, necessidade ou código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs text-white placeholder-slate-500"
                />
              </div>
            </div>

            {/* Province List Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
              {filteredProvinces.map((prov) => {
                const isSelected = prov.id === selectedProvinceId;
                const percentOfTotal = ((prov.totalAllocated / totalBaseAllocated) * 100).toFixed(1);

                return (
                  <button
                    key={prov.id}
                    onClick={() => setSelectedProvinceId(prov.id)}
                    className={`p-3.5 rounded-2xl text-left border transition-all flex flex-col justify-between gap-2 relative overflow-hidden ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                        : 'bg-slate-900/60 border-white/5 hover:bg-slate-800/60 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-white/10 text-emerald-300 font-mono font-bold text-[10px]">
                          {prov.code}
                        </span>
                        <span className="font-bold text-white text-xs truncate max-w-[120px]">
                          {prov.name}
                        </span>
                      </div>

                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        prov.urgencyLevel === 'Crítica'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : prov.urgencyLevel === 'Alta'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {prov.urgencyLevel}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between text-xs">
                      <span className="text-slate-400 text-[11px]">Alocado:</span>
                      <span className="text-emerald-400 font-bold font-mono">
                        R$ {prov.totalAllocated.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    {/* Progress bar ratio */}
                    <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                        style={{ width: `${Math.min(parseFloat(percentOfTotal) * 4, 100)}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>{prov.familiesBenefited} famílias</span>
                      <span>{percentOfTotal}% do total</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Selected Region Detail Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-emerald-500/30 backdrop-blur-xl space-y-6 sticky top-24 shadow-2xl">
            {/* Header of Selected Region */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono font-bold text-xs">
                    {selectedProvince.code}
                  </span>
                  <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold">
                    Zona {selectedProvince.zone}
                  </span>
                </div>
                <h2 className="text-2xl font-extrabold text-white mt-1">
                  {selectedProvince.name}
                </h2>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                selectedProvince.status === 'Entregas Ativas'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : selectedProvince.status === 'Envio em Trânsito'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {selectedProvince.status}
              </span>
            </div>

            {/* Financial Overview Cards for Selected Region */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Alocado</span>
                <span className="text-lg font-bold text-emerald-400 font-mono">
                  R$ {selectedProvince.totalAllocated.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Famílias Atendidas</span>
                <span className="text-lg font-bold text-white">
                  {selectedProvince.familiesBenefited} lares
                </span>
              </div>
            </div>

            {/* Primary Need Focus Box */}
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 space-y-2">
              <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Prioridade Humanitária Atual</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                "{selectedProvince.primaryNeed}"
              </p>
            </div>

            {/* Category Breakdown (Food, Medicine, Energy, Direct) */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Composição da Ajuda Enviada</span>
                <span className="text-[10px] text-slate-400 font-normal">Base regional</span>
              </h3>

              <div className="space-y-2 text-xs">
                {/* Alimentos */}
                <div className="space-y-1">
                  <div className="flex justify-between text-slate-300">
                    <span className="flex items-center gap-1.5"><Utensils className="w-3.5 h-3.5 text-amber-400" /> Alimentos & Cestas</span>
                    <span className="font-bold text-amber-300">{selectedProvince.categories.alimentos}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${selectedProvince.categories.alimentos}%` }}></div>
                  </div>
                </div>

                {/* Medicamentos */}
                <div className="space-y-1">
                  <div className="flex justify-between text-slate-300">
                    <span className="flex items-center gap-1.5"><Pill className="w-3.5 h-3.5 text-rose-400" /> Medicamentos & Insumos</span>
                    <span className="font-bold text-rose-300">{selectedProvince.categories.medicamentos}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-rose-400 rounded-full" style={{ width: `${selectedProvince.categories.medicamentos}%` }}></div>
                  </div>
                </div>

                {/* Energia */}
                <div className="space-y-1">
                  <div className="flex justify-between text-slate-300">
                    <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-yellow-400" /> Energia Solar / Lâmpadas</span>
                    <span className="font-bold text-yellow-300">{selectedProvince.categories.energia}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${selectedProvince.categories.energia}%` }}></div>
                  </div>
                </div>

                {/* Apoio Direto */}
                <div className="space-y-1">
                  <div className="flex justify-between text-slate-300">
                    <span className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Apoio Direto Emergencial</span>
                    <span className="font-bold text-emerald-300">{selectedProvince.categories.apoio_direto}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${selectedProvince.categories.apoio_direto}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Log Delivery Report */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 space-y-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Último Registro Logístico</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <p className="text-xs text-slate-300 italic">
                "{selectedProvince.recentLog}"
              </p>
            </div>

            {/* Direct Donate Button targeted at this region */}
            <button
              onClick={onOpenDonateModal}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4 fill-slate-950/30" />
              <span>Apoiar {selectedProvince.name} Agora</span>
            </button>
          </div>
        </div>
      </div>

      {/* Comprehensive Region Distribution Table */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-white/10 backdrop-blur-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-400" />
              <span>Relatório Detalhado de Distribuição por Província</span>
            </h2>
            <p className="text-slate-400 text-xs">Visão tabulada com auditoria financeira e status de entrega local</p>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            Mostrando {filteredProvinces.length} de {CUBA_PROVINCES.length} províncias
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-white/10">
              <tr>
                <th className="p-3.5">Província / Código</th>
                <th className="p-3.5">Zona</th>
                <th className="p-3.5">Total Alocado</th>
                <th className="p-3.5">Participação %</th>
                <th className="p-3.5">Lares Atendidos</th>
                <th className="p-3.5">Nível Urgência</th>
                <th className="p-3.5">Necessidade Principal</th>
                <th className="p-3.5 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProvinces.map((p) => {
                const percentOfTotal = ((p.totalAllocated / totalBaseAllocated) * 100).toFixed(1);
                return (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-white">{p.name}</div>
                      <span className="text-[10px] font-mono text-emerald-400">{p.code}</span>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                        {p.zone}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold font-mono text-emerald-300 text-sm">
                      R$ {p.totalAllocated.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono">{percentOfTotal}%</span>
                        <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div className="h-full bg-emerald-400" style={{ width: `${Math.min(parseFloat(percentOfTotal) * 4, 100)}%` }}></div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 font-bold text-white">
                      {p.familiesBenefited} lares
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.urgencyLevel === 'Crítica'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : p.urgencyLevel === 'Alta'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {p.urgencyLevel}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-300 max-w-[220px] truncate text-[11px]">
                      {p.primaryNeed}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => setSelectedProvinceId(p.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold transition-all"
                      >
                        Inspecionar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

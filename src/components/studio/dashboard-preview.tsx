import { BarChart3, Bell, Boxes, ChevronDown, Coffee, LayoutDashboard, ListOrdered, QrCode, ShoppingBag, TrendingUp } from 'lucide-react';

export function DashboardPreview() {
  return <div className="dashboard" aria-label="Contoh dashboard Cafe Flow POS dengan data ilustrasi">
    <aside className="dash-sidebar">
      <div className="dash-brand"><Coffee size={19} className="text-primary" />cafe<span className="text-primary">flow.</span></div>
      {[{ icon: LayoutDashboard, text: 'Dashboard' }, { icon: ShoppingBag, text: 'Point of Sale' }, { icon: ListOrdered, text: 'Orders' }, { icon: QrCode, text: 'QR Menu' }, { icon: Boxes, text: 'Inventory' }, { icon: BarChart3, text: 'Reports' }].map(({ icon: Icon, text }, i) => <div key={text} className={`dash-nav ${i === 0 ? 'active' : ''}`}><Icon size={13} />{text}</div>)}
      <div className="mt-8 border-t border-border px-2 pt-3 text-muted-foreground">Cafe Flow POS <span className="text-primary">• Preview</span></div>
    </aside>
    <div className="dash-main">
      <div className="dash-topbar"><span className="flex items-center gap-2 font-semibold">Overview <ChevronDown size={10} /></span><span className="flex items-center gap-3"><Bell size={12} /><span className="rounded-full bg-blue-soft px-2 py-1 font-bold text-primary">AS</span><span>Alvin's Coffee</span></span></div>
      <div className="dash-body">
        <div className="flex items-start justify-between gap-1"><div><h4 className="text-[11px] font-bold md:text-[14px]">Selamat pagi, Alvin</h4><p className="mt-1 text-muted-foreground">Berikut ringkasan bisnis kamu hari ini.</p></div><span className="shrink-0 rounded border border-border bg-background px-2 py-1.5">Hari ini <ChevronDown className="ml-1 inline" size={9} /></span></div>
        <div className="dash-stats">{[{ label: 'Total Penjualan', value: 'Rp 2.450.000', compact: 'Rp2,45jt', change: '+18.5%', icon: TrendingUp }, { label: 'Total Transaksi', value: '48', compact: '48', change: '+12.8%', icon: ShoppingBag }, { label: 'Rata-rata Transaksi', value: 'Rp 51.042', compact: 'Rp51rb', change: '+5.2%', icon: BarChart3 }].map(({ label, value, compact, change, icon: Icon }) => <div className="dash-stat" key={label}><div className="flex justify-between gap-1 text-muted-foreground">{label}<Icon size={12} className="shrink-0 text-primary" /></div><strong><span className="hidden md:inline">{value}</span><span className="md:hidden">{compact}</span></strong><span className="text-success">↗ {change}</span><span className="ml-1 text-muted-foreground">vs kemarin</span></div>)}</div>
        <div className="dash-chart"><div className="flex justify-between"><strong>Ringkasan Penjualan</strong><span className="text-muted-foreground">7 hari terakhir</span></div><div className="chart-bars">{['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((day, i) => <div key={day} className="chart-column"><div className={`chart-bar bar-${i + 1}`} /><span className="text-muted-foreground">{day}</span></div>)}</div></div>
      </div>
    </div>
  </div>;
}
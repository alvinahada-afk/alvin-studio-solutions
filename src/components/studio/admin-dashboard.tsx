import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Check, Eye, LogOut, Save, Settings, Shield, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { defaultSiteContent } from '@/hooks/use-site-content';

type Content = typeof defaultSiteContent;

const tabs = [
  ['general','Website'],
  ['hero','Hero'],
  ['problems','Masalah'],
  ['solutions','Solusi'],
  ['product','Cafe Flow'],
  ['projects','Project'],
  ['process','Cara Kerja'],
  ['pricing','Harga'],
  ['cta','CTA'],
] as const;

export function AdminDashboard() {
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login'|'signup'>('login');
  const [content, setContent] = useState<Content>(defaultSiteContent);
  const [active, setActive] = useState<(typeof tabs)[number][0]>('general');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [admin, setAdmin] = useState<boolean|null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({data}) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, next) => setSession(next));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session || !supabase) return;
    supabase.from('admin_users').select('user_id').eq('user_id', session.user.id).maybeSingle()
      .then(({data}) => setAdmin(!!data));
    loadContent();
  }, [session]);

  async function loadContent() {
    if (!supabase) return;
    const { data, error } = await supabase.from('site_content').select('content').eq('id','default').maybeSingle();
    if (error) setStatus(error.message);
    if (data?.content) setContent({...defaultSiteContent, ...data.content});
  }

  async function authSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return setStatus('Supabase belum terhubung. Pastikan VITE_SUPABASE_URL dan VITE_SUPABASE_PUBLISHABLE_KEY tersedia.');
    setBusy(true); setStatus('');
    const result = mode === 'login'
      ? await supabase.auth.signInWithPassword({email, password})
      : await supabase.auth.signUp({email, password});
    if (result.error) setStatus(result.error.message);
    else if (mode === 'signup' && result.data.user) {
      const claim = await supabase.rpc('claim_first_admin');
      if (claim.data) setStatus('Admin berhasil dibuat. Cek email jika Supabase meminta konfirmasi.');
      else setStatus('Akun dibuat. Jika email confirmation aktif, konfirmasi email lalu login.');
    }
    setBusy(false);
  }

  async function save() {
    if (!supabase || !session || !admin) return;
    setBusy(true); setStatus('');
    const { error } = await supabase.from('site_content').upsert({id:'default',content,updated_at:new Date().toISOString()});
    setStatus(error ? error.message : 'Perubahan tersimpan. Website publik akan membaca data terbaru.');
    setBusy(false);
  }

  async function claimAdmin() {
    if (!supabase) return;
    const {data,error}=await supabase.rpc('claim_first_admin');
    if(error) setStatus(error.message);
    else if(data){setAdmin(true);setStatus('Akun ini sekarang menjadi admin pertama.');}
    else setStatus('Admin sudah ada atau sesi belum siap.');
  }

  function update(path:string[], value:any) {
    setContent(prev => {
      const next = structuredClone(prev) as any;
      let ref = next;
      path.slice(0,-1).forEach(k => ref = ref[k]);
      ref[path[path.length-1]] = value;
      return next;
    });
  }

  const json = (key:keyof Content) => JSON.stringify(content[key], null, 2);
  const setJson = (key:keyof Content, value:string) => {
    try { update([key as string], JSON.parse(value)); setStatus(''); }
    catch { setStatus('JSON belum valid.'); }
  };

  if (!session) return <AuthScreen email={email} setEmail={setEmail} password={password} setPassword={setPassword} mode={mode} setMode={setMode} busy={busy} status={status} onSubmit={authSubmit}/>;
  if (admin === false) return <div className="min-h-screen bg-background flex items-center justify-center p-6"><div className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-sm"><Shield className="text-primary mb-4"/><h1 className="text-2xl font-bold">Admin belum diklaim</h1><p className="mt-2 text-sm text-muted-foreground">Akun pertama yang kamu klaim akan menjadi admin Alvin Studio.</p><Button className="mt-6 w-full" onClick={claimAdmin}>Jadikan akun ini Admin</Button><Button variant="ghost" className="mt-2 w-full" onClick={()=>supabase?.auth.signOut()}>Keluar</Button></div></div>;

  return <div className="min-h-screen bg-muted/30 text-foreground">
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4"><div><div className="text-lg font-bold tracking-tight">alvin<span className="font-medium">studio</span><span className="text-primary">.</span> <span className="ml-2 text-xs font-medium text-muted-foreground">Control Center</span></div><p className="text-[11px] text-muted-foreground">Kontrol website dari satu tempat</p></div><div className="flex items-center gap-2"><Button variant="outline" asChild><a href="/"><Eye/> Lihat Website</a></Button><Button variant="ghost" onClick={()=>supabase?.auth.signOut()}><LogOut/> Keluar</Button></div></div></header>
    <div className="mx-auto grid max-w-7xl gap-6 px-5 py-6 lg:grid-cols-[210px_1fr]">
      <aside className="h-fit rounded-2xl border bg-background p-2 lg:sticky lg:top-24">{tabs.map(([id,label])=><button key={id} onClick={()=>setActive(id)} className={`w-full rounded-xl px-3 py-2.5 text-left text-sm transition ${active===id?'bg-primary text-primary-foreground':'hover:bg-muted'}`}>{label}</button>)}<div className="mt-4 border-t pt-3 text-xs text-muted-foreground"><Settings size={14} className="mb-2"/>Login: {session.user.email}</div></aside>
      <main className="min-w-0">
        <div className="mb-5 flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-widest text-primary">Editor</p><h1 className="mt-1 text-2xl font-bold">{tabs.find(t=>t[0]===active)?.[1]}</h1></div><Button onClick={save} disabled={busy}><Save/>{busy?'Menyimpan...':'Simpan Perubahan'}</Button></div>
        {status && <div className="mb-4 rounded-xl border bg-background px-4 py-3 text-sm">{status}</div>}
        <Editor active={active} content={content} update={update} json={json} setJson={setJson}/>
      </main>
    </div>
  </div>;
}

function Field({label,value,onChange,area=false}:{label:string,value:any,onChange:(v:string)=>void,area?:boolean}) {
  return <label className="block space-y-2"><span className="text-xs font-semibold">{label}</span>{area?<Textarea value={value??''} onChange={e=>onChange(e.target.value)} className="min-h-28"/>:<Input value={value??''} onChange={e=>onChange(e.target.value)}/>}</label>;
}

function Editor({active,content,update,json,setJson}:{active:string,content:Content,update:(p:string[],v:any)=>void,json:(k:keyof Content)=>string,setJson:(k:keyof Content,v:string)=>void}) {
  const section = (key:keyof Content, label:string) => <div className="rounded-2xl border bg-background p-5"><div className="mb-4 flex items-center gap-2"><Sparkles size={17} className="text-primary"/><h2 className="font-semibold">{label}</h2></div><Textarea value={json(key)} onChange={e=>setJson(key,e.target.value)} className="min-h-[420px] font-mono text-xs"/></div>;
  if(active==='general') return <div className="grid gap-4 md:grid-cols-2">{[['brand','Nama Brand'],['tagline','Tagline'],['whatsapp','WhatsApp'],['email','Email'],['instagram','Instagram']].map(([k,l])=><Field key={k} label={l} value={(content.settings as any)[k]} onChange={v=>update(['settings',k],v)}/>)}</div>;
  if(active==='hero') return <div className="grid gap-4 rounded-2xl border bg-background p-5">{[['badge','Badge'],['title','Judul Hero'],['description','Deskripsi'],['note','Catatan']].map(([k,l])=><Field key={k} label={l} value={(content.hero as any)[k]} onChange={v=>update(['hero',k],v)} area={k!=='badge'}/>)}</div>;
  if(active==='product') return <div className="grid gap-4 rounded-2xl border bg-background p-5">{[['name','Nama Produk'],['description','Deskripsi']].map(([k,l])=><Field key={k} label={l} value={(content.product as any)[k]} onChange={v=>update(['product',k],v)} area={k==='description'}/>) }{section('product','Fitur Produk & konfigurasi')}</div>;
  if(active==='cta') return <div className="grid gap-4 rounded-2xl border bg-background p-5">{[['title','Judul CTA'],['description','Deskripsi CTA']].map(([k,l])=><Field key={k} label={l} value={(content.cta as any)[k]} onChange={v=>update(['cta',k],v)} area={k==='description'}/>)}</div>;
  return section(active as keyof Content, tabs.find(t=>t[0]===active)?.[1] ?? 'Section');
}

function AuthScreen(p:any) {
  return <div className="min-h-screen bg-muted/30 flex items-center justify-center p-6"><div className="w-full max-w-md rounded-3xl border bg-background p-8 shadow-xl"><div className="mb-8"><div className="text-xl font-bold">alvin<span className="font-medium">studio</span><span className="text-primary">.</span></div><p className="mt-2 text-sm text-muted-foreground">Control Center · {p.mode==='login'?'Masuk ke dashboard':'Buat akun admin pertama'}</p></div><form onSubmit={p.onSubmit} className="space-y-4"><Field label="Email" value={p.email} onChange={p.setEmail}/><Field label="Password" value={p.password} onChange={p.setPassword}/><Button className="w-full" disabled={p.busy}>{p.busy?'Memproses...':p.mode==='login'?'Masuk':'Buat Admin'}</Button></form>{p.status&&<p className="mt-4 rounded-xl bg-muted p-3 text-xs">{p.status}</p>}<button className="mt-6 w-full text-xs font-semibold text-primary" onClick={()=>p.setMode(p.mode==='login'?'signup':'login')}>{p.mode==='login'?'Belum punya akun admin? Buat akun':'Sudah punya akun? Masuk'}</button></div></div>;
}

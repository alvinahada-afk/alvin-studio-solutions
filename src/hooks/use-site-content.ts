import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export const defaultSiteContent = {
  settings: { brand:'Alvin Studio', tagline:'Digital solutions. Real business impact.', whatsapp:'', email:'', instagram:'' },
  hero: { badge:'Partner digital untuk bisnis kamu', title:'Digital Solutions untuk Bisnis yang Ingin Berkembang', description:'Website profesional, POS, QR Ordering, dan sistem custom untuk membantu bisnis berjalan lebih efektif.', note:'Solusi sesuai kebutuhan. Proses jelas. Siap berkembang.' },
  problems: [
    {title:'Pesanan masih manual',text:'Catatan tercecer, pesanan terlewat, dan antrian yang semakin panjang.'},
    {title:'Data transaksi berantakan',text:'Rekap memakan waktu. Sulit tahu angka penjualan yang sebenarnya.'},
    {title:'Belum punya website',text:'Calon pelanggan kesulitan menemukan dan mengenal bisnis kamu.'},
    {title:'Monitoring terasa sulit',text:'Harus selalu di lokasi untuk tahu apa yang terjadi dalam bisnis.'}
  ],
  solutions: [
    {title:'Website Business',text:'Kesan pertama yang profesional. Website yang membangun kepercayaan dan membuka peluang baru.',items:['Desain sesuai identitas bisnis','Optimal di semua perangkat','SEO dasar & loading cepat']},
    {title:'POS & QR Ordering',text:'Dari pesanan hingga laporan. Satu sistem untuk operasional yang lebih cepat dan terorganisir.',items:['Kasir & transaksi terintegrasi','QR menu & pemesanan digital','Inventory & laporan penjualan']},
    {title:'Custom System',text:'Setiap bisnis punya cara kerja unik. Kami membangun sistem yang mengikuti kebutuhanmu.',items:['Alur kerja sesuai kebutuhan','Dashboard & monitoring bisnis','Solusi yang siap berkembang']}
  ],
  product:{name:'Cafe Flow POS',description:'Fokus menyajikan yang terbaik untuk pelanggan. Biar Cafe Flow membantu mengelola operasional di baliknya.',features:['POS','QR Menu','Orders','Inventory','Reports']},
  projects:[
    {title:'Cafe Flow POS',subtitle:'POS System · QR Ordering · Dashboard',image:''},
    {title:'Business Website',subtitle:'Konsep Website · Brand Experience · Mobile-friendly',image:''}
  ],
  process:[
    {title:'Consultation',text:'Ceritakan bisnis, tantangan, dan tujuan kamu.'},
    {title:'Scope',text:'Sepakati fitur, timeline, dan biaya yang transparan.'},
    {title:'Development',text:'Kami membangun solusi dengan update berkala.'},
    {title:'Review',text:'Cek bersama, beri masukan, dan sempurnakan.'},
    {title:'Handover',text:'Solusi siap digunakan, lengkap dengan panduan.'}
  ],
  pricing:[
    {name:'Website',price:'Rp600K',desc:'Mulai hadir secara digital.',items:['Landing page bisnis','Desain mobile-friendly','Informasi & kontak bisnis'],popular:false},
    {name:'Company Profile',price:'Rp800K',desc:'Tampilkan bisnis lebih profesional.',items:['Halaman profil perusahaan','Layanan & portfolio','SEO dasar'],popular:false},
    {name:'Business Website',price:'Rp1.2JT',desc:'Lebih lengkap untuk bisnis kamu.',items:['Website multi-halaman','Fitur sesuai kebutuhan','SEO dasar & optimasi'],popular:true},
    {name:'POS / Custom',price:'Custom',desc:'Solusi yang mengikuti bisnismu.',items:['POS & QR Ordering','Dashboard operasional','Scope sesuai kebutuhan'],popular:false}
  ],
  cta:{title:'Siap bawa bisnismu ke level berikutnya?',description:'Mulai dari obrolan sederhana. Kita temukan solusi yang tepat.'}
};

export function useSiteContent() {
  const [content, setContent] = useState(defaultSiteContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) { setLoading(false); return; }
    supabase.from('site_content').select('content').eq('id','default').maybeSingle()
      .then(({data}) => {
        if (data?.content) setContent({ ...defaultSiteContent, ...data.content });
      })
      .finally(() => setLoading(false));
  }, []);

  return { content, loading };
}

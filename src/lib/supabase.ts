type Session = { access_token: string; user: { id: string; email?: string } };

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;
const storageKey = 'alvinstudio_supabase_session';
const listeners = new Set<(event: string, session: Session | null) => void>();

function getStored(): Session | null {
  try { return JSON.parse(localStorage.getItem(storageKey) || 'null'); } catch { return null; }
}
function store(session: Session | null) {
  if (session) localStorage.setItem(storageKey, JSON.stringify(session));
  else localStorage.removeItem(storageKey);
}
async function request(path:string, options:RequestInit = {}, token?:string) {
  if (!url || !key) throw new Error('Supabase environment variables belum diatur.');
  const res = await fetch(url.replace(/\/$/,'') + path, {
    ...options,
    headers: { apikey:key, 'Content-Type':'application/json', ...(token ? {Authorization:`Bearer ${token}`} : {}), ...(options.headers || {}) },
  });
  const text = await res.text();
  let data:any = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!res.ok) return {data:null,error:{message:data?.msg || data?.message || data?.error_description || text || res.statusText}};
  return {data,error:null};
}
const auth = {
  async getSession(){return {data:{session:getStored()},error:null};},
  onAuthStateChange(cb:(event:string,session:Session|null)=>void){listeners.add(cb);return {data:{subscription:{unsubscribe(){listeners.delete(cb);}}}};},
  async signInWithPassword({email,password}:{email:string,password:string}){const r=await request('/auth/v1/token?grant_type=password',{method:'POST',body:JSON.stringify({email,password})});if(r.error)return r;const s=r.data as Session;store(s);listeners.forEach(cb=>cb('SIGNED_IN',s));return {data:{session:s,user:s.user},error:null};},
  async signUp({email,password}:{email:string,password:string}){const r=await request('/auth/v1/signup',{method:'POST',body:JSON.stringify({email,password}));if(r.error)return r;if(r.data?.access_token){store(r.data);listeners.forEach(cb=>cb('SIGNED_IN',r.data));}return {data:r.data,error:null};},
  async signOut(){const s=getStored();if(s)await request('/auth/v1/logout',{method:'POST'},s.access_token);store(null);listeners.forEach(cb=>cb('SIGNED_OUT',null));return {error:null};}
};
function from(table:string){
  return {
    select(columns:string){
      let filter='';
      const query={eq(column:string,value:string){filter=`&${column}=eq.${encodeURIComponent(value)}`;return query;},async maybeSingle(){const r=await request(`/rest/v1/${table}?select=${encodeURIComponent(columns)}${filter}`,{method:'GET'},getStored()?.access_token);if(r.error)return r;const rows=Array.isArray(r.data)?r.data:[];return {data:rows[0]??null,error:null};}};
      return query;
    },
    async upsert(payload:any){return request(`/rest/v1/${table}`,{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=representation'},body:JSON.stringify(payload)},getStored()?.access_token);}
  };
}
const rpc=async(name:string)=>request(`/rest/v1/rpc/${name}`,{method:'POST',body:'{}'},getStored()?.access_token);
export const supabase=url&&key?{auth,from,rpc}:null;
import { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import { auth } from './firebase';
import './demo.css';
const BASE=(import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/,'')+'/api/v1';
type Profile={id:string,email:string,name:string,role:'customer'|'owner'|'admin'};
type House={id:string,name:string,city:string,address:string,pricePerNight:number,status:string};
async function api(path:string,token?:string,method='GET',body?:unknown){
 const res=await fetch(BASE+path,{method,headers:{...(token?{Authorization:'Bearer '+token}:{}),...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});
 const obj=await res.json().catch(()=>({}));if(!res.ok) throw new Error(obj.message||`${res.status} ${res.statusText}`);return obj;
}
export default function DemoPortal(){
 const [user,setUser]=useState<User|null>(null),[profile,setProfile]=useState<Profile|null>(null);
 const [mode,setMode]=useState<'login'|'owner'>('login'),[email,setEmail]=useState(''),[password,setPassword]=useState(''),[message,setMessage]=useState('');
 const [houses,setHouses]=useState<House[]>([]),[publicHouses,setPublicHouses]=useState<House[]>([]);
 const [name,setName]=useState(''),[city,setCity]=useState('Gaborone'),[address,setAddress]=useState(''),[price,setPrice]=useState('450'),[description,setDescription]=useState('');
 const token=()=>auth.currentUser?.getIdToken(true);
 const refresh=async()=>{
  const pub=await api('/guesthouses?size=50');setPublicHouses(pub.content||[]);
  if(auth.currentUser){const t=await token();const me=await api('/me',t);setProfile(me);
   if(me.role==='admin'){const all=await api('/admin/guesthouses?size=50',t);setHouses(all.content||[]);}else setHouses([]);
  }
 };
 useEffect(()=>onAuthStateChanged(auth,async u=>{setUser(u);setMessage('');if(u){try{const t=await u.getIdToken();const me=await api('/me',t);setProfile(me)}catch{setProfile(null)}}else setProfile(null);try{const pub=await api('/guesthouses?size=50');setPublicHouses(pub.content||[])}catch(e){setMessage(String(e))}}),[]);
 const submitAuth=async(e:React.FormEvent)=>{e.preventDefault();setMessage('');try{
  const credential=mode==='owner'?await createUserWithEmailAndPassword(auth,email,password):await signInWithEmailAndPassword(auth,email,password);
  const t=await credential.user.getIdToken();const me=await api('/auth/sync',t,'POST',mode==='owner'?{role:'owner'}:{});setProfile(me);setMessage(`Authenticated as ${me.role}.`);await refresh();
 }catch(e){setMessage(String(e))}};
 const addHouse=async(e:React.FormEvent)=>{e.preventDefault();setMessage('');try{
  const t=await token();const newHouse=await api('/admin/guesthouses',t,'POST',{name,city,address,pricePerNight:Number(price),description,amenities:[],contact:{}});
  setMessage(`Created draft: ${newHouse.name}. Publish to show it on mobile.`);setName('');await refresh();
 }catch(e){setMessage(String(e))}};
 const status=async(id:string,next:string)=>{try{await api(`/admin/guesthouses/${id}/status`,await token(),'PATCH',{status:next});setMessage(`Changed status to ${next}`);await refresh()}catch(e){setMessage(String(e))}};
 return <div className="demo"><header><strong>LocateBase</strong><span>COMP 311 • Local integration demonstration</span><a href="/admin">Original dashboard</a></header>
 <main><section className="hero"><h1>Guesthouse Discovery Platform</h1><p>One Firebase identity, Spring Boot API, and MongoDB database across web and mobile.</p></section>
 {message&&<div role="status" className="notice">{message}</div>}
 <div className="columns"><section className="panel"><h2>{user?'Your account':mode==='login'?'Sign in':'Owner registration'}</h2>
 {!user?<><div className="mode"><button onClick={()=>setMode('login')}>Sign in</button><button onClick={()=>setMode('owner')}>Register owner</button></div><form onSubmit={submitAuth}><label>Email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></label><label>Password<input type="password" minLength={6} value={password} onChange={e=>setPassword(e.target.value)} required /></label><button className="primary">{mode==='login'?'Sign in':'Create owner account'}</button></form><p className="hint">Admin accounts must be provisioned separately by an authorized administrator; public admin sign-up is disabled.</p></>:
 <><p><strong>{profile?.email||user.email}</strong></p><p>Backend role: <b>{profile?.role||'syncing...'}</b></p><button onClick={()=>signOut(auth)}>Sign out</button><button onClick={()=>void refresh()}>Refresh data</button></>}
 </section><section className="panel"><h2>Public guesthouses</h2><p className="hint">Only published listings appear here and in the mobile app.</p><button onClick={()=>void refresh()}>Refresh listings</button>{publicHouses.length===0?<p>No published listings returned.</p>:publicHouses.map(h=><div className="house" key={h.id}><strong>{h.name}</strong><span>{h.city} · P{h.pricePerNight}/night</span></div>)}</section></div>
 {profile?.role==='admin'&&<><section className="panel"><h2>Admin · Add guesthouse</h2><p className="hint">Location and photos are optional for this classroom demonstration. Listings are created as drafts.</p><form className="houseform" onSubmit={addHouse}><label>Name<input required value={name} onChange={e=>setName(e.target.value)}/></label><label>City<input required value={city} onChange={e=>setCity(e.target.value)}/></label><label>Address<input value={address} onChange={e=>setAddress(e.target.value)}/></label><label>Nightly price (BWP)<input type="number" min="1" required value={price} onChange={e=>setPrice(e.target.value)}/></label><label>Description<textarea value={description} onChange={e=>setDescription(e.target.value)}/></label><button className="primary">Save as draft</button></form></section><section className="panel"><h2>Admin · Manage listing status</h2>{houses.map(h=><div className="house" key={h.id}><strong>{h.name} <small>({h.status})</small></strong><span>{h.city} · P{h.pricePerNight}</span><div><button onClick={()=>status(h.id,'published')}>Publish</button><button onClick={()=>status(h.id,'draft')}>Draft</button><button onClick={()=>status(h.id,'suspended')}>Suspend</button></div></div>)}</section></>}
 {profile?.role==='owner'&&<section className="panel"><h2>Owner portal</h2><p>Owner authentication works. The listing-request workflow is a separate backend phase and is not yet implemented in this demo.</p></section>}
 </main></div>;
}

import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView } from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from './services/firebase';
export default function Login(){
 const [email,setEmail]=useState(''),[password,setPassword]=useState(''),[notice,setNotice]=useState(''),[role,setRole]=useState('');
 async function action(signup:boolean){
  try{setNotice('Connecting...');const credentials=signup?await createUserWithEmailAndPassword(auth,email,password):await signInWithEmailAndPassword(auth,email,password);
   const token=await credentials.user.getIdToken();const base=process.env.EXPO_PUBLIC_API_URL;
   if(!base)throw new Error('Configure EXPO_PUBLIC_API_URL');
   const response=await fetch(base.replace(/\/$/,'')+'/api/v1/auth/sync',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},body:JSON.stringify(signup?{role:'customer'}:{})});
   const result=await response.json();if(!response.ok)throw new Error(result.message||'API error');setRole(result.role);setNotice('Signed in as '+result.email+' ('+result.role+')');
  }catch(e){setNotice(String(e))}
 }
 return <ScrollView contentContainerStyle={styles.page}><Text style={styles.title}>Welcome to LocateBase</Text><Text style={styles.text}>Create a customer account or sign in with your existing Firebase account.</Text><TextInput autoCapitalize="none" keyboardType="email-address" placeholder="Email address" value={email} onChangeText={setEmail} style={styles.input}/><TextInput secureTextEntry placeholder="Password (min 6 characters)" value={password} onChangeText={setPassword} style={styles.input}/><Pressable style={styles.button} onPress={()=>action(false)}><Text style={styles.buttonText}>Sign in</Text></Pressable><Pressable style={styles.secondary} onPress={()=>action(true)}><Text style={styles.secondaryText}>Create customer account</Text></Pressable>{auth.currentUser&&<Pressable onPress={async()=>{await signOut(auth);setRole('');setNotice('Signed out')}}><Text style={styles.text}>Sign out</Text></Pressable>}<Text style={styles.text}>{notice}</Text>{!!role&&<Text style={styles.text}>Backend-authorized role: {role}</Text>}</ScrollView>
}
const styles=StyleSheet.create({page:{flexGrow:1,paddingHorizontal:28,paddingTop:155,paddingBottom:100,backgroundColor:'#F8F7F4'},title:{color:'#9B1C2B',fontSize:27,fontWeight:'bold',marginBottom:15},text:{color:'#303030',fontSize:15,marginBottom:16},input:{padding:13,backgroundColor:'white',borderColor:'#cccccc',borderWidth:1,borderRadius:10,marginVertical:8},button:{backgroundColor:'#9B1C2B',padding:16,borderRadius:12,alignItems:'center',marginTop:15},buttonText:{color:'white',fontWeight:'bold'},secondary:{backgroundColor:'#CDEBDD',padding:16,borderRadius:12,alignItems:'center',marginVertical:12},secondaryText:{color:'#1B3830',fontWeight:'bold'}});

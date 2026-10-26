const API_URL=process.env.EXPO_PUBLIC_API_URL;
export type Guesthouse={id:string;name:string;description:string;city:string;address:string;pricePerNight:number;amenities:string[];images:string[];photos:{publicId:string;url:string}[];contact:{phone?:string;whatsapp?:string;email?:string};ratingAverage:number;averageRating:number;ratingCount:number;location:{type:string;coordinates:number[]}|null};
type PageResponse<T>={content:T[];page:number;size:number;totalElements:number;totalPages:number};
export async function getGuesthouses():Promise<PageResponse<Guesthouse>>{
 if(!API_URL)throw new Error('Set EXPO_PUBLIC_API_URL to your computer LAN IP (not localhost on your phone)');
 const r=await fetch(API_URL.replace(/\/$/,'')+'/api/v1/guesthouses?size=50');if(!r.ok)throw new Error('API returned '+r.status);
 const data=await r.json();return {...data,content:(data.content||[]).map((g:Guesthouse)=>({...g,images:(g.photos||[]).map(p=>p.url),averageRating:g.ratingAverage||0}))};
}

import React, { useState, useEffect } from 'react'; // This line is now corrected
import { motion } from 'framer-motion';
import Button from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Input, Textarea } from './components/ui/input';
import { Badge } from './components/ui/badge';
import { Phone, Mail, MapPin, Leaf, Ship, Shield, Sparkles, ArrowLeft } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: (i=0)=>({ opacity:1, y:0, transition:{ delay: i*0.08 } }) }

const DEFAULT_META = {
  companyName: "TOP SELECTION EXPORT PRIVATE LIMITED",
  headline: "Premium Agro Exports — Sourced with Care, Delivered with Pride.",
  tagline: "Spices & Agro-Commodities from India",
  phone: "+91-9110759557",
  email: "topselectionexport@gmail.com",
  location: "Guntur, Andhra Pradesh, India",
};

const img = {
  chilli: 'https://tse4.mm.bing.net/th/id/OIP.fddp5obPfx9ThNMEvn8-ZwHaE8?pid=Api',
  coirPith: 'https://raw.githubusercontent.com/tpsriram72/topselection-images/main/Coir-Pith.png',
  coirFibre: 'https://raw.githubusercontent.com/tpsriram72/topselection-images/main/coirfibre.png',
}

const DEFAULT_PRODUCTS = [
  { id:'red-chilli', title:'Red Chilli', img: img.chilli, points:['Varieties: S17 Teja, 334 Guntur, Byadgi','Heat: 35k–90k SHU','Grades: Whole, Stemless, Crushed, Powder'] },
  { id:'coir-pith', title:'Coir Pith', img: img.coirPith, points:['Low EC, washed & buffered options','Ideal for hydroponics & soil conditioning', 'Forms: 5kg blocks, 650g briquettes'] },
  { id:'coir-fibre', title:'Coir Fibre', img: img.coirFibre, points:['Natural, biodegradable brown fibre','Uses: Ropes, mats, erosion control', 'Packing: Tightly strapped bales'] }
]

const RFQ_ENDPOINT = 'https://formspree.io/f/xnngjvar'

const RED_CHILLI_VARIANTS = {
  'teja-s17': {
    id:'teja-s17', name:'Teja S17', overview:'Teja S17 is a high-yield red chilli variety prized for its bright red colour, good pungency and suitability for both fresh and dried chilli markets. It is popular with processors for its uniformity and consistent heat profile.', specs:{ kind:'Teja (S17)', type:'Whole chilli with stem, Whole chilli without stem', colorValue:'45-70 ASTA (varies by drying and curing)', heatValue:'30,000-60,000 SHU (typical range)', packing:'25 kg jute/gunny bags or as per buyer requirement', inspection:'Spice Board of India / Pre-shipment inspection available', loading:'14 MT in a 40 ft container' }, notes:'Suitable for powder, flakes and paste. Recommended for buyers looking for a balance between colour and heat. We offer cleaning, stem removal and low-moisture drying as per spec.'
  },
  'byadgi': {
    id:'byadgi', name:'Byadgi Chilli', overview:'The range of Byadgi Chilli that we offer is famous for its vibrant red color and its rich taste. This is a special variety and has gained wide popularity all across the world. Our personnel procure and process these chilies to ensure their rich colors, flavor and taste.', specs:{ kind:'Byadgi (100% Wrinkled)', type:'Whole chilli with stem, Whole chilli without stem', colorValue:'90-100 ASTA', heatValue:'8,000-15,000 SHU', packing:'25 kg gunny bag or as per buyer requirement', inspection:'Spice Board Of India', loading:'14 MT in a 40 ft container' }, notes:'Available in a wide variety of package sizes and at economical prices. Well-suited for markets prioritizing colour over heat.'
  },
  'sannam-s4': {
    id:'sannam-s4', name:'Sannam S4 (334)', overview:'Sannam S4 is a sought-after chilli variety known for its consistent pungency and suitability for hot-chilli markets. It is often used for grinding into powders and for value-added products.', specs:{ kind:'Sannam S4 (334)', type:'Whole chilli with stem, Whole chilli without stem', colorValue:'35-40 ASTA', heatValue:'15,000-25,000 SHU', packing:'25 kg gunny bag or as per buyer requirement', inspection:'Spice Board Of India', loading:'14 MT in a 40 ft container' }, notes:'Known for its natural hot seasoning qualities and multiple health benefits. Good option for buyers seeking higher heat levels.'
  }
}

const COIR_PITH_DETAILS = {
  id: 'coir-pith', name: 'Coir Pith (Coco Peat)', overview: 'A natural, versatile growing medium made from coconut husks, coir pith (or coco peat) is prized for its excellent water retention, aeration, and eco-friendly properties. It is a sustainable alternative to traditional peat moss.', specs: { Form: '5 kg Blocks, 650g Briquettes', 'EC Level': 'Low EC (<0.5 mS/cm), High EC (Unwashed)', pH: '5.5 to 6.8', Expansion: 'Approx. 70-75 Liters per 5kg block', Sieving: 'Fine mesh sieving to remove excess fibre', Packing: 'Palletized, stretch-wrapped blocks or individual briquettes', Loading: '20-22 MT in a 40 ft container' }, notes: 'Washed, unwashed, and buffered options are available to meet specific horticultural needs. Ideal for greenhouse cultivation, hydroponics, soil amendment, and as a potting mix.'
}

const COIR_FIBRE_DETAILS = {
  id: 'coir-fibre', name: 'Coir Fibre (Brown)', overview: 'A strong, durable, and biodegradable natural fibre extracted from mature coconut husks. Brown coir fibre is known for its resilience and is widely used in various industrial, horticultural, and upholstery applications.', specs: { Grade: 'Brown Fibre', 'Fibre Length': '10cm to 25cm', Moisture: 'Below 15%', Impurities: 'Below 3%', Color: 'Natural Golden Brown', Packing: '120-150 kg tightly strapped bales', Loading: '18-20 MT in a 40 ft container' }, notes: 'Commonly used for manufacturing ropes, twines, doormats, brushes, erosion control blankets, and mattress filling. Our fibre is cleaned and processed to ensure uniform quality and low impurity levels.'
}

function ProductDetailPage({ product, meta, form, setForm, submit, loading, status }) {
  const year = new Date().getFullYear();
  return (
    <div className='min-h-screen w-full bg-white text-slate-800'>
      <header className='sticky top-0 z-30 backdrop-blur bg-white/80 border-b'>
        <div className='mx-auto max-w-7xl px-4 py-3 flex items-center justify-between'>
          <div className='flex items-center gap-2'><Leaf className='h-6 w-6' /><a href='#' className='font-semibold tracking-wide'>{meta.companyName}</a></div>
          <a href='#' className='inline-flex items-center gap-2 bg-white text-slate-700 border border-slate-300 px-4 py-1.5 rounded-xl text-sm font-medium hover:bg-slate-50 hover:border-slate-400 transition-colors'>
            <ArrowLeft className='h-4 w-4' /> Back to Home
          </a>
        </div>
      </header>

      <main className='mx-auto max-w-5xl px-4 py-12'>
        <div className='grid md:grid-cols-3 gap-8'>
          <div className='md:col-span-2'>
            <h1 className='text-2xl font-bold'>{product.name}</h1>
            <p className='mt-3 text-slate-700'>{product.overview}</p>

            <div className='mt-8'>
              <h2 className='text-lg font-semibold'>Specifications</h2>
              <table className='mt-3 w-full text-sm text-slate-700 border-collapse'>
                <tbody>
                  {Object.entries(product.specs).map(([key, value]) => (
                    <tr key={key}><td className='py-2 font-medium capitalize'>{key}</td><td className='py-2'>{value}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className='mt-6'>
              <h2 className='text-lg font-semibold'>Notes</h2>
              <p className='mt-2 text-slate-700'>{product.notes}</p>
            </div>

            <div className='mt-10'>
              <h2 className='text-lg font-semibold'>Request Samples / Quote</h2>
              <form onSubmit={submit} className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div><label className='text-sm font-medium'>Your Name</label><Input required placeholder='Jane / Acme Imports' value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} /></div>
                <div><label className='text-sm font-medium'>Email</label><Input required type='email' placeholder='buyer@company.com' value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} /></div>
                <div className='md:col-span-2'><label className='text-sm font-medium'>Message</label><Textarea required rows={6} placeholder={`I need ${product.name} - quantity, destination port, packaging...`} value={form.message} onChange={(e)=>setForm({...form,message:e.target.value})} /></div>
                <div className='md:col-span-2 flex items-center justify-between'><div className='text-xs text-slate-500'>By submitting, you agree to be contacted.</div><Button type='submit' className='' disabled={loading}>{loading? 'Sending…':'Send Inquiry'}</Button></div>
                {status && (<div className={`md:col-span-2 text-sm ${status.ok?'text-green-700':'text-rose-700'}`}>{status.msg}</div>)}
              </form>
            </div>
          </div>

          <aside className='space-y-4'>
            <Card className='rounded-2xl'><CardHeader><CardTitle>Contact</CardTitle></CardHeader><CardContent className='space-y-3 text-sm text-slate-700'><div className='flex items-start gap-3'><Phone className='h-4 w-4 mt-0.5'/> <span>{meta.phone}</span></div><div className='flex items-start gap-3'><Mail className='h-4 w-4 mt-0.5'/> <span>{meta.email}</span></div><div className='flex items-start gap-3'><MapPin className='h-4 w-4 mt-0.5'/> <span>{meta.location}</span></div></CardContent></Card>
            <Card className='rounded-2xl'><CardHeader><CardTitle>Packing & Logistics</CardTitle></CardHeader><CardContent className='text-slate-700 text-sm'>We offer custom packing solutions including blocks, briquettes, and bales. Door-to-port and door-to-door (DDP) options available. Pre-shipment inspections can be arranged.</CardContent></Card>
          </aside>
        </div>
      </main>

      <footer className='border-t bg-white mt-10'><div className='mx-auto max-w-7xl px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-600'><div>© {year} {meta.companyName}. All rights reserved.</div><div className='flex items-center gap-3'><a href='#' className='hover:text-amber-700'>Home</a><a href='#products' className='hover:text-amber-700'>Products</a><a href='#quality' className='hover:text-amber-700'>Quality</a><a href='#about' className='hover:text-amber-700'>About</a><a href='#contact' className='hover:text-amber-700'>Contact</a></div></div></footer>
    </div>
  );
}

export default function ExportWebsite({ meta = DEFAULT_META, products = DEFAULT_PRODUCTS }){
  const [form, setForm] = useState({ name:'', email:'', message:'' })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)
  const year = new Date().getFullYear()

  const [route, setRoute] = useState(()=> window.location.hash || '')
  
  useEffect(()=>{
    const onHash = ()=> setRoute(window.location.hash||'');
    window.addEventListener('hashchange', onHash);
    return ()=> window.removeEventListener('hashchange', onHash)
  },[])

  useEffect(() => {
    if (route.startsWith('#product/')) {
      window.scrollTo(0, 0);
    } else {
      const id = route.substring(1);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [route]);

  const submit = async (e)=>{
    e.preventDefault()
    setStatus(null)
    if(!form.name||!form.email||!form.message){ setStatus({ok:false,msg:'Please fill all fields.'}); return }
    try{ setLoading(true)
      await fetch(RFQ_ENDPOINT, {
        method:'POST',
        headers:{ 'Content-Type':'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({...form, source:'website'})
      })
      setForm({name:'',email:'',message:''})
      setStatus({ok:true,msg:'Thanks — we received your request and will reply shortly.'})
    }catch(err){ setStatus({ok:false,msg:`Request failed: ${err.message}`}) }finally{ setLoading(false) }
  }

  if(route.startsWith('#product/')){
    const parts = route.replace(/^#/,'').split('/')
    const productId = parts[1]
    const commonProps = { meta, form, setForm, submit, loading, status };

    if (productId === 'coir-pith') {
      return <ProductDetailPage product={COIR_PITH_DETAILS} {...commonProps} />;
    }
    
    if (productId === 'coir-fibre') {
      return <ProductDetailPage product={COIR_FIBRE_DETAILS} {...commonProps} />;
    }

    if(productId === 'red-chilli'){
      const variantId = parts[2] || 'teja-s17'
      const variant = RED_CHILLI_VARIANTS[variantId] || RED_CHILLI_VARIANTS['teja-s17']
      return (
        <div className='min-h-screen w-full bg-white text-slate-800'>
          <header className='sticky top-0 z-30 backdrop-blur bg-white/80 border-b'>
            <div className='mx-auto max-w-7xl px-4 py-3 flex items-center justify-between'>
              <div className='flex items-center gap-2'><Leaf className='h-6 w-6' /><a href='#' className='font-semibold tracking-wide'>{meta.companyName}</a></div>
              <a href='#' className='inline-flex items-center gap-2 bg-white text-slate-700 border border-slate-300 px-4 py-1.5 rounded-xl text-sm font-medium hover:bg-slate-50 hover:border-slate-400 transition-colors'>
                <ArrowLeft className='h-4 w-4' /> Back to Home
              </a>
            </div>
          </header>

          <main className='mx-auto max-w-5xl px-4 py-12'>
            <div className='grid md:grid-cols-3 gap-8'>
              <div className='md:col-span-2'>
                <h1 className='text-2xl font-bold'>{variant.name}</h1>
                <p className='mt-3 text-slate-700'>{variant.overview}</p>

                <div className='mt-6 mb-8 flex gap-3'>
                  <a href={`#product/red-chilli/teja-s17`} className={`px-4 py-2 rounded-2xl ${variantId === 'teja-s17' ? 'bg-amber-600 text-white' : 'bg-white border'}`}>Teja S17</a>
                  <a href={`#product/red-chilli/byadgi`} className={`px-4 py-2 rounded-2xl ${variantId === 'byadgi' ? 'bg-amber-600 text-white' : 'bg-white border'}`}>Byadgi</a>
                  <a href={`#product/red-chilli/sannam-s4`} className={`px-4 py-2 rounded-2xl ${variantId === 'sannam-s4' ? 'bg-amber-600 text-white' : 'bg-white border'}`}>Sannam S4</a>
                </div>

                <div className='mt-6'>
                  <h2 className='text-lg font-semibold'>Specifications</h2>
                  <table className='mt-3 w-full text-sm text-slate-700 border-collapse'>
                    <tbody>
                      {Object.entries(variant.specs).map(([key, value]) => (
                         <tr key={key}><td className='py-2 font-medium capitalize'>{key.replace(/([A-Z])/g, ' $1')}</td><td className='py-2'>{value}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className='mt-6'>
                  <h2 className='text-lg font-semibold'>Notes</h2>
                  <p className='mt-2 text-slate-700'>{variant.notes}</p>
                </div>

                <div className='mt-10'>
                  <h2 className='text-lg font-semibold'>Request Samples / Quote</h2>
                  <form onSubmit={submit} className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div><label className='text-sm font-medium'>Your Name</label><Input required placeholder='Jane / Acme Imports' value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} /></div>
                    <div><label className='text-sm font-medium'>Email</label><Input required type='email' placeholder='buyer@company.com' value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} /></div>
                    <div className='md:col-span-2'><label className='text-sm font-medium'>Message</label><Textarea required rows={6} placeholder={`I need ${variant.name} - quantity, destination port, packaging...`} value={form.message} onChange={(e)=>setForm({...form,message:e.target.value})} /></div>
                    <div className='md:col-span-2 flex items-center justify-between'><div className='text-xs text-slate-500'>By submitting, you agree to be contacted.</div><Button type='submit' className='' disabled={loading}>{loading? 'Sending…':'Send Inquiry'}</Button></div>
                    {status && (<div className={`md:col-span-2 text-sm ${status.ok?'text-green-700':'text-rose-700'}`}>{status.msg}</div>)}
                  </form>
                </div>
              </div>

              <aside className='space-y-4'>
                <Card className='rounded-2xl'><CardHeader><CardTitle>Contact</CardTitle></CardHeader><CardContent className='space-y-3 text-sm text-slate-700'><div className='flex items-start gap-3'><Phone className='h-4 w-4 mt-0.5'/> <span>{meta.phone}</span></div><div className='flex items-start gap-3'><Mail className='h-4 w-4 mt-0.5'/> <span>{meta.email}</span></div><div className='flex items-start gap-3'><MapPin className='h-4 w-4 mt-0.5'/> <span>{meta.location}</span></div></CardContent></Card>
                <Card className='rounded-2xl'><CardHeader><CardTitle>Packing & Logistics</CardTitle></CardHeader><CardContent className='text-slate-700 text-sm'>We offer 25 kg jute/gunny bags, mesh or cartons as required. Door-to-port and door-to-door (DDP) options available. Sample shipments and pre-shipment inspections can be arranged.</CardContent></Card>
              </aside>
            </div>
          </main>

          <footer className='border-t bg-white mt-10'><div className='mx-auto max-w-7xl px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-600'><div>© {year} {meta.companyName}. All rights reserved.</div><div className='flex items-center gap-3'><a href='#' className='hover:text-amber-700'>Home</a><a href='#products' className='hover:text-amber-700'>Products</a><a href='#quality' className='hover:text-amber-700'>Quality</a><a href='#about' className='hover:text-amber-700'>About</a><a href='#contact' className='hover:text-amber-700'>Contact</a></div></div></footer>
        </div>
      )
    }
  }

  return (
    <div className='min-h-screen w-full bg-gradient-to-b from-white via-amber-50/40 to-white text-slate-800'>
      <header className='sticky top-0 z-30 backdrop-blur bg-white/80 border-b'>
        <div className='relative mx-auto max-w-7xl px-4 py-4 flex items-center justify-center md:justify-end'>
          <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2'>
            <Leaf className='h-6 w-6' />
            <a href='#' className='font-semibold tracking-wide text-center'>{meta.companyName}</a>
          </div>
          
          <nav className='hidden md:flex items-center gap-6 text-sm'>
            <a href='#products' className='hover:text-amber-700'>Products</a>
            <a href='#quality' className='hover:text-amber-700'>Quality</a>
            <a href='#about' className='hover:text-amber-700'>About</a>
            <a href='#contact' className='hover:text-amber-700'>Contact</a>
          </nav>
        </div>
      </header>

      <section className='relative overflow-hidden' aria-label='Hero'>
        <HeroFadeCarousel images={products.map(p=>p.img).slice(0,3)} intervalMs={4500} />

        <div className='pointer-events-none absolute inset-0 bg-gradient-to-r from-black/60 to-black/20' />
        <div className='absolute inset-0 z-10 flex items-center'>
          <div className='mx-auto max-w-7xl px-4 py-16 md:py-24'>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className='max-w-3xl text-white'>
              <Badge>{meta.tagline}</Badge>
              <p className='mt-3 text-xl md:text-2xl text-white/90'>Welcome to</p>
              <h1 className='mt-1 text-4xl md:text-6xl font-extrabold leading-tight'>
                {meta.companyName}
              </h1>
              <p className='mt-4 text-xl md:text-2xl text-white/90 max-w-2xl'>{meta.headline}</p>
              <p className='mt-4 md:text-lg text-white/80'>Reliable sourcing, verified lots, and global logistics for spices & fresh produce.</p>
              <div className='mt-6 flex flex-wrap gap-3'><Button asChild className='rounded-2xl'><a href='#products'>Explore Products</a></Button><Button variant='outline' className='rounded-2xl bg-white/10 text-white border-white/40 hover:bg-white hover:text-slate-900'><a href='#contact'>Request a Quote</a></Button></div>
              <div className='mt-6 flex items-center gap-4 text-white/80 text-sm'><div className='flex items-center gap-2'><Shield className='h-4 w-4'/>Quality-First</div><div className='flex items-center gap-2'><Ship className='h-4 w-4'/>On-time Logistics</div><div className='flex items-center gap-2'><Sparkles className='h-4 w-4'/>Custom Packaging</div></div>
            </motion.div>
          </div>
        </div>
      </section>
      
      <section id='products' className='py-16 bg-gradient-to-br from-amber-50 to-white'>
        <div className='mx-auto max-w-7xl px-4'>
          <motion.h2 initial='hidden' whileInView='visible' viewport={{ once: true }} variants={fadeUp} className='text-2xl md:text-3xl font-bold'>Our Products</motion.h2>
          <p className='mt-2 text-slate-600 max-w-2xl'>Curated selection tailored to import standards. COAs and samples available on request.</p>

          <div className='mt-8 grid grid-cols-1 md:grid-cols-3 gap-6'>
            {products.map((p,idx)=>(
              <motion.div key={p.id} initial='hidden' whileInView='visible' viewport={{ once: true }} custom={idx} variants={fadeUp}>
                <a href={`#product/${p.id}`} className='block'>
                  <Card className='overflow-hidden hover:shadow-xl transition-shadow rounded-2xl'>
                    <div className='h-40 w-full bg-cover bg-center' style={{ backgroundImage: `url(${p.img})` }} role='img' aria-label={p.title} />
                    <CardHeader><CardTitle className='text-lg font-semibold'>{p.title}</CardTitle></CardHeader>
                    <CardContent className='pt-0'><ul className='space-y-2 text-sm text-slate-600 list-disc pl-5'>{p.points.map(pt=>(<li key={pt}>{pt}</li>))}</ul></CardContent>
                  </Card>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id='quality' className='bg-white py-16 border-t'>
        <div className='mx-auto max-w-7xl px-4'>
          <motion.h2 initial='hidden' whileInView='visible' viewport={{ once: true }} variants={fadeUp} className='text-2xl md:text-3xl font-bold'>Quality & Compliance</motion.h2>
          <div className='mt-6 grid grid-cols-1 md:grid-cols-3 gap-6'>
            {[{title:'Farm-to-Port Traceability',desc:'Lot-wise records; moisture, ASTA colour/SHU/curcumin tests; photos & pack notes included.'},{title:'Global Certifications',desc:'APEDA registered; FSSAI compliant; Phytosanitary & Fumigation certificates arranged per shipment.'},{title:'Custom Specs',desc:'Sieving, stem-removal, low-moisture drying, and private labeling as required.'}].map((b,i)=>(<motion.div key={b.title} initial='hidden' whileInView='visible' viewport={{ once:true }} custom={i} variants={fadeUp}><Card className='rounded-2xl h-full'><CardHeader><CardTitle>{b.title}</CardTitle></CardHeader><CardContent className='text-slate-600'>{b.desc}</CardContent></Card></motion.div>))}
          </div>
        </div>
      </section>

      <section id='about' className='mx-auto max-w-7xl px-4 py-16'>
        <div className='grid md:grid-cols-2 gap-10 items-center'>
          <motion.div initial='hidden' whileInView='visible' viewport={{ once:true }} variants={fadeUp}><h2 className='text-2xl md:text-3xl font-bold'>About {meta.companyName}</h2><p className='mt-3 text-slate-700 leading-relaxed'>We are an India-based sourcing partner focused on high-quality spices and coconut products. Our team works closely with farmers and primary processors across southern India to ensure consistency and reliability.</p><ul className='mt-4 space-y-2 text-slate-700 text-sm list-disc pl-5'><li>Flexible MOQs and mixed-container shipments</li><li>Door-to-port and door-to-door options (Incoterms as agreed)</li><li>Transparent sampling and pre-shipment inspection</li></ul></motion.div>
          <motion.div initial={{ opacity:0, scale:0.96 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }} transition={{ duration:0.5 }} className='aspect-video rounded-2xl overflow-hidden shadow-lg'><img src={products[0]?.img} alt='About us' className='h-full w-full object-cover' loading='lazy' /></motion.div>
        </div>
      </section>

      <section id='contact' className='bg-gradient-to-br from-amber-50 to-white border-t'>
        <div className='mx-auto max-w-7xl px-4 py-16'>
          <motion.h2 initial='hidden' whileInView='visible' viewport={{ once:true }} variants={fadeUp} className='text-2xl md:text-3xl font-bold'>Request a Quote</motion.h2>
          <p className='mt-2 text-slate-600 max-w-2xl'>Tell us your product, grade/specs, destination port, and quantity. We’ll revert with prices, lead times, and samples.</p>

          <div className='mt-8 grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='md:col-span-2'>
              <Card className='rounded-2xl'><CardContent className='pt-6'><form onSubmit={submit} className='grid grid-cols-1 md:grid-cols-2 gap-4' aria-label='RFQ form'><div><label className='text-sm font-medium'>Your Name</label><Input required placeholder='Jane / Acme Imports' value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} /></div><div><label className='text-sm font-medium'>Email</label><Input required type='email' placeholder='buyer@company.com' value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} /></div><div className='md:col-span-2'><label className='text-sm font-medium'>Message</label><Textarea required rows={6} placeholder='Product, grade, quantity, destination, packaging…' value={form.message} onChange={(e)=>setForm({...form,message:e.target.value})} /></div><div className='md:col-span-2 flex items-center justify-between'><div className='text-xs text-slate-500'>By submitting, you agree to be contacted.</div><Button type='submit' className='' disabled={loading}>{loading? 'Sending…':'Send Inquiry'}</Button></div>{status && (<div className={`md:col-span-2 text-sm ${status.ok?'text-green-700':'text-rose-700'}`}>{status.msg}</div>)}</form></CardContent></Card>
            </div>

            <div className='space-y-4'>
              <Card className='rounded-2xl'><CardHeader><CardTitle>Contact</CardTitle></CardHeader><CardContent className='space-y-3 text-sm text-slate-700'><div className='flex items-start gap-3'><Phone className='h-4 w-4 mt-0.5'/> <span>{meta.phone}</span></div><div className='flex items-start gap-3'><Mail className='h-4 w-4 mt-0.5'/> <span>{meta.email}</span></div><div className='flex items-start gap-3'><MapPin className='h-4 w-4 mt-0.5'/> <span>{meta.location}</span></div></CardContent></Card>
              <Card className='rounded-2xl'><CardHeader><CardTitle>Why Buyers Choose Us</CardTitle></CardHeader><CardContent><ul className='space-y-2 text-sm text-slate-700 list-disc pl-5'><li>Consistent quality, verifiable lots</li><li>Fast responses, clear documentation</li><li>Strong network across southern India</li></ul></CardContent></Card>
            </div>
          </div>
        </div>
      </section>

      <footer className='border-t bg-white'><div className='mx-auto max-w-7xl px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-600'><div>© {year} {meta.companyName}. All rights reserved.</div><div className='flex items-center gap-3'><a href='#' className='hover:text-amber-700'>Home</a><a href='#products' className='hover:text-amber-700'>Products</a><a href='#quality' className='hover:text-amber-700'>Quality</a><a href='#about' className='hover:text-amber-700'>About</a><a href='#contact' className='hover:text-amber-700'>Contact</a></div></div></footer>
    </div>
  )
}

function HeroFadeCarousel({ images, intervalMs=4000 }){
  const [index, setIndex] = useState(0)
  useEffect(()=>{
    if(!images || images.length===0) return
    const t = setInterval(()=> setIndex(i=> (i+1)%images.length), intervalMs)
    return ()=> clearInterval(t)
  },[images, intervalMs])
  if(!images || images.length===0) return null
  return (
    <div className='relative h-[60vh] min-h-[360px] w-full'>
      {images.map((src,i)=>(
        <motion.img key={src+i} src={src} alt={`Hero slide ${i+1}`} initial={{ opacity:0 }} animate={{ opacity: i===index?1:0 }} transition={{ duration:0.8 }} className='absolute inset-0 h-full w-full object-cover' loading='lazy' />
      ))}
      <div className='absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2'>
        {images.map((_,i)=>(<button key={i} onClick={()=>setIndex(i)} aria-label={`Go to slide ${i+1}`} className={`h-2 w-2 rounded-full ${i===index? 'bg-white/90':'bg-white/40'}`} />))}
      </div>
    </div>
  )
}

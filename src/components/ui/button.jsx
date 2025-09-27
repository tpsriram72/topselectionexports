import React from 'react'

export default function Button({ children, variant='default', className='', ...props }){
  const base = 'px-4 py-2 rounded-2xl inline-block text-sm font-medium';
  const variants = {
    default: 'bg-amber-600 text-white hover:bg-amber-700',
    outline: 'bg-white/10 border border-white/40',
  }
  return <button className={`${base} ${variants[variant]||variants.default} ${className}`} {...props}>{children}</button>
}

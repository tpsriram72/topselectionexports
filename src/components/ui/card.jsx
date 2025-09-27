import React from 'react'
export function Card({ children, className='' }){
  return <div className={`overflow-hidden shadow-sm rounded-2xl bg-white ${className}`}>{children}</div>
}
export function CardHeader({ children }){ return <div className='px-4 py-3 border-b'><h3 className='text-lg font-semibold'>{children}</h3></div> }
export function CardContent({ children }){ return <div className='p-4'>{children}</div> }
export function CardTitle({ children }){ return <div className='text-lg font-semibold'>{children}</div> }

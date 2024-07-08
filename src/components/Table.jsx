import { Icon } from '@iconify/react'
import React from 'react'

export const Table = ({ children, className, loading = false, list }) => {
    return (
        <div className={`${className} ${loading ? 'overflow-hidden' : 'overflow-auto'}`}>
            <table className="w-full text-left transition-all table-auto">
                {children}
            </table>
            {loading ?
                (<div className='flex justify-center pt-4'>
                    <Icon icon={'mingcute:loading-fill'} className='text-[27px] animate-spin' />
                </div>) :
                ((list?.length == 0 || !list) &&
                    <h3 className='w-full pt-4 text-center'>Tidak ada data</h3>
                )
            }
        </div>

    )
}

export const TableHead = ({ children }) => {
    return (
        <thead className="sticky top-0 z-10 duration-150 border-b border-gray-100">
            {children}
        </thead>
    )
}

export const HeadRow = ({ children, className }) => {
    return (
        <tr className={`rounded-xl ${className}`}>
            {children}
        </tr>
    )
}

export const HeadItem = ({ children, className, start, end }) => {
    const marginx = start ? 'pr-2 md:pr-6' : end ? 'pl-2 md:pl-6' : 'px-2 md:px-6'
    return (
        <th className={`py-3 ${marginx} ${className}`}>
            {children}
        </th>
    )
}

export const TableBody = ({ children }) => {
    return (
        <tbody className='text-xs duration-150'>
            {children}
        </tbody>
    )
}

export const BodyRow = ({ children, className }) => {
    return (
        <tr className={`rounded-xl hover:bg-gray-50 ${className}`}>
            {children}
        </tr>
    )
}

export const BodyItem = ({ children, className, start, end }) => {
    const marginx = start ? 'pr-2 md:pr-6' : end ? 'pl-2 md:pl-6' : 'px-2 md:px-6'
    return (
        <td className={`py-2 ${marginx} ${className}`}>
            {children}
        </td>
    )
}

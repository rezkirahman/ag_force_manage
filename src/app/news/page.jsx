"use client"
import Container from '@/components/Container'
import Layout from '@/components/Layout'
import { Button, IconButton, InputAdornment, TextField, Tooltip } from '@mui/material'
import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Icon } from '@iconify/react'

const Page = () => {
    const [search, setSearch] = useState('')
    const [openModalAddNews, setOpenModalAddNews] = useState(false)
    const [openModalEditNews, setOpenModalEditNews] = useState(false)

    return (
        <Layout>
            <Container>
                <div className='flex flex-wrap items-start justify-between gap-4'>
                    <h3 className='text-lg font-semibold'>News</h3>
                    <div className='flex items-center justify-end gap-4 grow'>
                        <TextField
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            label='Search'
                            className='w-full md:w-1/2'
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><Icon icon={'material-symbols:search'} /></InputAdornment>,
                            }}
                        />
                        <Button
                            variant='contained'
                            size='large'
                        >
                            Tambah
                        </Button>
                    </div>
                </div>
            </Container>
            <div className='grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4'>
                <NewsCard news={''} />
            </div>
        </Layout>
    )
}

export default Page

const NewsCard = ({ news }) => {
    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.75, ease: "easeInOut" }}
            className='relative w-full h-full space-y-4 bg-white rounded-2xl shadow-container overflow-clip'
        >
            <Image
                src={'/dummy-image.jpg'}
                alt='cover'
                width={500}
                height={500}
                className='object-cover object-top w-full h-40'
            />
            <div className='absolute top-0 px-3 py-1 text-xs bg-green-700 rounded-full right-2 md:right-4'>
                <h3 className='text-xs font-semibold text-white'>Disetujui</h3>
            </div>
            <div className='flex flex-col gap-4 px-4 pb-6 md:px-6'>
                <div className='space-y-1'>
                    <h3 className='font-semibold line-clamp-3'>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias sequi natus veritatis blanditiis minima! Obcaecati aliquid et cum, ex at sit sequi officia laudantium, laborum dolore aliquam sapiente hic sunt?
                    </h3>
                    <h3 className='text-xs'>12 April 2022</h3>
                </div>
                <div className='flex items-center gap-3 mx-auto w-fit'>
                    <Tooltip arrow title='Detil Karyawan'>
                        <IconButton
                            size="small"
                        >
                            <Icon icon='fluent:document-person-16-filled' />
                        </IconButton>
                    </Tooltip>
                    <Tooltip arrow title='Detil Karyawan'>
                        <IconButton
                            size="small"
                            color='error'
                        >
                            <Icon icon='mdi:delete' />
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
        </motion.div>
    )
}
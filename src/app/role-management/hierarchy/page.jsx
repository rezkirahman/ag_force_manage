'use client'
import { listHierarchy, resetHierarchy } from '@/api/role-management/hierarchy'
import Header from '@/components/Header'
import Layout from '@/components/Layout'
import { theme } from '@/config/materialui-config'
import { useAppContext } from '@/context'
import { Button, ThemeProvider } from '@mui/material'
import React, { useEffect, useCallback, useState } from 'react'
import { Tree, TreeNode } from 'react-organizational-chart'
import CardRole from '@/components/role-management/hierarchy/CardRole'
import SnackbarNotification from '@/components/SnackbarNotification'
import { Icon } from '@iconify/react'
import ModalDeleteConfirmation from '@/components/ModalDeleteConfirmation'
import { motion, useMotionValue } from 'framer-motion'

const Page = () => {
    localStorage.setItem('isZoomActive', 'true')
    const { unitKerja, setOpenSnackbar } = useAppContext()
    const [hierarchy, setHierarchy] = useState([])
    const [openModalReset, setOpenModalReset] = useState(false)
    const [loadingReset, setLoadingReset] = useState(false)
    const zoom = useMotionValue(1)
    const initialX = window.innerWidth / 2 - 1000
    const initialY = window.innerHeight / 2 - 1000
    const x = useMotionValue(initialX)
    const y = useMotionValue(initialY)

    const handleListHierarchy = useCallback(async () => {
        if (!unitKerja) return
        const { data } = await listHierarchy({ unitKerja: unitKerja.id })
        if (data?.data) {
            setHierarchy(data.data)
        }
    }, [unitKerja])
    useEffect(() => { handleListHierarchy() }, [handleListHierarchy])

    const handleReset = useCallback(async () => {
        if (!unitKerja) return
        setLoadingReset(true)
        const { data } = await resetHierarchy({ unitKerja: unitKerja.id })
        if (data?.code == 200) {
            setOpenSnackbar({
                open: true,
                severity: 'success',
                message: 'Berhasil mereset struktur jabatan'
            })
            handleListHierarchy()
            setOpenModalReset(false)
        }
        setLoadingReset(false)
    }, [handleListHierarchy, setOpenSnackbar, unitKerja])

    const handleWheel = (e) => {
        const isZoomActive = localStorage.getItem('isZoomActive')
        if (isZoomActive === 'false') return
        zoom.set(Math.min(Math.max(zoom.get() + e?.deltaY * -0.001, 0.5), 3))
    }

    return (
        <ThemeProvider theme={theme}>
            <SnackbarNotification />
            <div className="sr-only">
                <Layout></Layout>
            </div>
            <div className="relative w-screen h-screen text-sm text-gray-600 overflow-clip bg-primary/5">
                <ModalDeleteConfirmation
                    title={'Reset Struktur Jabatan'}
                    open={openModalReset}
                    setOpen={setOpenModalReset}
                    textButton={'Reset'}
                    loading={loadingReset}
                    handleDelete={handleReset}
                    description={<h3>Apakah Anda yakin mereset struktur jabatan?</h3>}
                />
                <div className="absolute inset-x-0 z-30 px-6 space-y-4 md:px-8 lg:px-12 top-4">
                    <Header isMenuButton />
                </div>
                <div className='absolute z-30 top-24 left-6 md:left-8 lg:left-12'>
                    <Button
                        variant='contained'
                        color='error'
                        startIcon={<Icon icon='carbon:reset' />}
                        onClick={() => setOpenModalReset(true)}
                    >
                        Reset
                    </Button>
                </div>
                <div className="flex items-center justify-center w-full h-full">
                    <motion.div
                        onWheel={handleWheel}
                        className="flex items-center justify-center min-h-[200vh] min-w-[200vw] overflow-auto"
                        style={{ scale: zoom, cursor: 'move' }}
                        drag
                        dragConstraints={{ left: -1000, right: 1000, top: -1000, bottom: 1000 }}
                        dragElastic={0.2}
                        dragMomentum={false}
                    >
                        {hierarchy && (
                            <RecursiveTree hierarchy={hierarchy} refresh={handleListHierarchy} />
                        )}
                    </motion.div>
                </div>
            </div>
        </ThemeProvider>
    )
}

export default Page

const RecursiveTree = ({ hierarchy, refresh, }) => {
    return (
        <Tree lineWidth={'2px'}
            lineColor={'#94a3b8'}
            lineBorderRadius={'12px'}
            label={<CardRole node={hierarchy} refresh={refresh} />}
        >
            {hierarchy?.organizationChildRelationship?.map((item, index) => (
                <RecursiveTreeNode key={index} node={item} refresh={refresh} />
            ))}
        </Tree>
    )
}

const RecursiveTreeNode = ({ node, refresh, }) => {
    return (
        <TreeNode label={<CardRole node={node} refresh={refresh} />}>
            {node.organizationChildRelationship?.map((child, index) => (
                <RecursiveTreeNode key={index} node={child} refresh={refresh} />
            ))}
        </TreeNode>
    )
}


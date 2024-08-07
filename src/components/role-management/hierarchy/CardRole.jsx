'use client'
import { deleteHierarchy } from "@/api/role-management/hierarchy"
import ModalDeleteConfirmation from "@/components/ModalDeleteConfirmation"
import { useAppContext } from "@/context"
import { Icon } from "@iconify/react"
import { IconButton, Tooltip } from "@mui/material"
import { useCallback, useState } from "react"
import ModalAddHierarchy from "./ModalAddHierarchy"

const CardRole = ({ node, refresh }) => {
    const { unitKerja, setOpenSnackbar } = useAppContext()
    const [openModalAddHierarchy, setOpenModalAddHierarchy] = useState(false)
    const [openModalDelete, setOpenModalDelete] = useState(false)
    const [loadingDelete, setLoadingDelete] = useState(false)

    const handleDelete = useCallback(async () => {
        if (!unitKerja) return
        setLoadingDelete(true)
        const { data } = await deleteHierarchy({
            unitKerja: unitKerja.id,
            id: node.id
        })
        if (data?.code == 200) {
            setOpenSnackbar({
                open: true,
                severity: 'success',
                message: 'Berhasil menghapus struktur jabatan'
            })
            refresh()
            setOpenModalDelete(false)
        }
        setLoadingDelete(false)
    }, [node, refresh, setOpenSnackbar, unitKerja])

    return (
        <div className="flex flex-col w-40 gap-2 p-4 mx-auto bg-white select-none ring-1 ring-gray-200 rounded-xl shadow-container item-center">
            <ModalAddHierarchy
                open={openModalAddHierarchy}
                setOpen={setOpenModalAddHierarchy}
                node={node}
                refresh={refresh}
            />
            <ModalDeleteConfirmation
                open={openModalDelete}
                setOpen={setOpenModalDelete}
                title="Hapus jabatan"
                handleDelete={handleDelete}
                loading={loadingDelete}
                description={<h3>Apakah Anda yakin menghapus <span className="font-semibold">{node?.tradingName}</span> ?</h3>}
            />
            <h3 className="text-center">{node?.tradingName}</h3>
            <div>
                <Tooltip arrow title='Tambah'>
                    <IconButton
                        size="small"
                        onClick={() => setOpenModalAddHierarchy(true)}
                    >
                        <Icon icon='material-symbols:add' />
                    </IconButton>
                </Tooltip>
                {node.id !== 0 && (
                    <Tooltip arrow title='Hapus'>
                        <IconButton
                            size="small"
                            color="error"
                            onClick={() => setOpenModalDelete(true)}
                        >
                            <Icon icon={'material-symbols:delete'} />
                        </IconButton>
                    </Tooltip>
                )}
            </div>
        </div>
    )
}

export default CardRole
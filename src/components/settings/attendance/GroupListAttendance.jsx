import Container from '@/components/Container'
import { BodyItem, BodyRow, HeadItem, HeadRow, Table, TableBody, TableHead } from '@/components/Table'
import { Icon } from '@iconify/react'
import { Alert, Button, IconButton, InputAdornment, TextField, Tooltip } from '@mui/material'
import React from 'react'

const GroupListAttendance = () => {
    const [search, setSearch] = React.useState('')
    const [openAddGroup, setOpenAddGroup] = React.useState(false)
    const [openEditGroup, setOpenEditGroup] = React.useState(false)
    const [openDeleteGroup, setOpenDeleteGroup] = React.useState(false)
    const [selectedGroup, setSelectedGroup] = React.useState(null)
    const [listGroup, setListGroup] = React.useState([])
    const [loading, setLoading] = React.useState(false)


    return (
        <Container>
            <div className='space-y-6'>
                <h3 className='font-semibold'>Daftar Group Geotagging</h3>
                <Alert severity='info'>Pengaturan ini digunakan untuk lokasi check-in attendance dengan metode geotagging.</Alert>
                <div className='flex items-center justify-between gap-3'>
                    <TextField
                        value={search}
                        placeholder='Cari Group'
                        variant='outlined'
                        className='md::w-1/4'
                        onChange={(e) => setSearch(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Icon icon={'mdi:magnify'} className="text-xl" />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button
                        size='large'
                        variant="contained"
                        onClick={() => setOpenAddGroup(true)}
                    >
                        Tambah Group
                    </Button>
                </div>
                <Table list={listGroup} loading={loading}>
                    <TableHead>
                        <HeadRow className={'align-top'}>
                            <HeadItem start>Nama</HeadItem>
                            <HeadItem>Karyawan</HeadItem>
                            <HeadItem>Lokasi</HeadItem>
                            <HeadItem end>Action</HeadItem>
                        </HeadRow>
                    </TableHead>
                    <TableBody>
                        {listGroup?.sort((a, b) => b.is_anywhere - a.is_anywhere).map((data, i) => (
                            <BodyRow key={i} className={'align-top'}>
                                <BodyItem start className={'font-medium'}>{data.title}</BodyItem>
                                <BodyItem>{data.total_user}</BodyItem>
                                <BodyItem>{data.location_names}</BodyItem>
                                <BodyItem end>
                                    <div className='flex items-center justify-center gap-2'>
                                        <Tooltip title='Ubah' arrow>
                                            <IconButton
                                                onClick={() => {
                                                    setSelectedGroup(data)
                                                    setOpenEditGroup(true)
                                                }}
                                            >
                                                <Icon icon={'material-symbols:edit'} className="text-lg" />
                                            </IconButton>
                                        </Tooltip>
                                        {!data.is_anywhere &&
                                            <Tooltip title='Hapus' arrow>
                                                <IconButton
                                                    color="error"
                                                    onClick={() => {
                                                        setSelectedGroup(data)
                                                        setOpenDeleteGroup(true)
                                                    }}
                                                >
                                                    <Icon icon={'akar-icons:trash-can'} className="text-lg" />
                                                </IconButton>
                                            </Tooltip>
                                        }
                                    </div>
                                </BodyItem>
                            </BodyRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Container>
    )
}

export default GroupListAttendance
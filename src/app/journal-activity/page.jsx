'use client'

import Layout from '@/components/Layout'
import React, { useCallback, useEffect, useState } from 'react'
import { BodyItem, BodyRow, HeadItem, HeadRow, TableHead, TableBody, Table } from '@/components/Table'
import Container from '@/components/Container'
import { useDebounce } from 'use-debounce'
import { IconButton, InputAdornment, Pagination, TextField, Tooltip } from '@mui/material'
import { Icon } from '@iconify/react'
import { useAppContext } from '@/context'
import dayjs from 'dayjs'
import { listJournalActivity } from '@/api/journal/journal'
import ModalFilterJournal from '@/components/journal-activity/ModalFilterJournal'
import ModalDetailJournal from '@/components/journal-activity/ModalDetailJournal'
import ModalExportJournal from '@/components/journal-activity/ModalExportJournal'

const Page = () => {
  const { unitKerja } = useAppContext()
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const [filter, setFilter] = useState({
    date: dayjs(),
    role: [],
  })
  const [listJournal, setListJournal] = useState([])
  const [loadingListJournal, setLoadingListJournal] = useState(false)
  const [openModalFilter, setOpenModalFilter] = useState(false)
  const [openModalDetail, setOpenModalDetail] = useState(false)
  const [openModalExport, setOpenModalExport] = useState(false)
  const [selectedJournal, setSelectedJournal] = useState({})
  const [search, setSearch] = useState('')
  const [searchDebounced] = useDebounce(search, 500)

  const handleListJournal = useCallback(async () => {
    if (!unitKerja) return
    setListJournal([])
    setLoadingListJournal(true)
    const body = {
      limit: 10,
      search: searchDebounced,
      page: page,
      role_id: filter.role,
      date: filter.date.format("YYYY-MM-DD")
    }
    const { data } = await listJournalActivity({
      unitKerja: unitKerja.id,
      body: body,
    })
    if (data?.data) {
      setPage(data?.pagination?.current_page)
      setTotalPage(data?.pagination?.total_pages)
      setListJournal(data?.data)
    }

    setLoadingListJournal(false)
  }, [filter, page, searchDebounced, unitKerja])

  useEffect(() => {
    handleListJournal()
  }, [handleListJournal])

  useEffect(() => {
    setPage(1)
  }, [filter, searchDebounced])

  return (
    <Layout>
      <Container>
        <ModalExportJournal
          open={openModalExport}
          setOpen={setOpenModalExport}
        />
        <ModalFilterJournal
          open={openModalFilter}
          setOpen={setOpenModalFilter}
          filter={filter}
          setFilter={setFilter}
        />
        <ModalDetailJournal
          open={openModalDetail}
          setOpen={setOpenModalDetail}
          user={selectedJournal}
        />
        <div className='space-y-6'>
          <div className='flex flex-wrap items-start justify-between gap-3'>
            <h3 className='text-lg font-semibold'>Jurnal Harian</h3>
            <div className='flex items-center justify-end gap-3 grow md:grow-0'>
              <TextField
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                label='Pencarian'
                className='grow'
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Icon icon={'material-symbols:search'} /></InputAdornment>,
                }}
              />
              <Tooltip title='Filter' arrow>
                <IconButton
                  size='large'
                  onClick={() => setOpenModalFilter(true)}
                >
                  <Icon icon="mage:filter-fill" />
                </IconButton>
              </Tooltip>
              <Tooltip title='Unduh' arrow>
                <IconButton
                  color='primary'
                  size='large'
                  className='ring-1 ring-primary'
                  onClick={() => setOpenModalExport(true)}
                >
                  <Icon icon={'mage:file-download-fill'} className='' />
                </IconButton>
              </Tooltip>
            </div>
          </div>
          <Table list={listJournal} loading={loadingListJournal}>
            <TableHead>
              <HeadRow className={'uppercase align-top'}>
                <HeadItem start>ID</HeadItem>
                <HeadItem>NIK</HeadItem>
                <HeadItem>Nama</HeadItem>
                <HeadItem>Jurnal</HeadItem>
                {/* <HeadItem>Jumlah</HeadItem> */}
                <HeadItem end>Aksi</HeadItem>
              </HeadRow>
            </TableHead>
            <TableBody>
              {listJournal?.map((item, i) => (
                <BodyRow key={i} className={'align-top'}>
                  <BodyItem start>{item.ref_id}</BodyItem>
                  <BodyItem>{item.nik}</BodyItem>
                  <BodyItem>
                    <Tooltip arrow title={`${item.full_name} - ${item.role_name}`}>
                      <div className="">
                        <h3 className="font-semibold line-clamp-1">{item.full_name}</h3>
                        <h3 className="text-xs line-clamp-1">{item.role_name}</h3>
                      </div>
                    </Tooltip>
                  </BodyItem>
                  <BodyItem>
                    <h3 className='line-clamp-2'>{item.content}</h3>
                  </BodyItem>
                  {/* <BodyItem>{item.total_activity}</BodyItem> */}
                  <BodyItem end>
                    <Tooltip title='Detail' arrow>
                      <IconButton
                        size='small'
                        onClick={() => {
                          setSelectedJournal(item)
                          setOpenModalDetail(true)
                        }}
                      >
                        <Icon icon='mdi:eye' className='' />
                      </IconButton>
                    </Tooltip>
                  </BodyItem>
                </BodyRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Pagination
          count={totalPage}
          page={page}
          onChange={(e, value) => setPage(value)}
          color='primary'
          size='small'
          className='mx-auto mt-4 w-fit'
        />
      </Container>
    </Layout>
  )
}

export default Page
import { useEffect, useState } from "react"
import ModalLayout from "../ModalLayout"
import { BodyItem, BodyRow, Table, TableBody } from "../Table"
const { Icon } = require("@iconify/react")
const { Modal, Tabs, Tab } = require("@mui/material")

const ModalPenugasanTracking = ({ open, setOpen, userOnduty, penugasan, handleClickGoToUser, setOpenDrawer }) => {
    const [tab, setTab] = useState(1)
    const [filteredOnduty, setFilteredOnduty] = useState([])
    const [filteredOffDuty, setFilteredOffDuty] = useState([])
    const [users, setUsers] = useState([])

    useEffect(() => {
        setUsers(penugasan?.users)
        const filteredUsers = userOnduty.filter(userOndutyItem =>
            users?.some(user => user?.user_id === userOndutyItem?.Id)
        );
        setFilteredOnduty(filteredUsers)
    }, [penugasan, userOnduty, users])

    useEffect(() => {
        const filteredUsers = filteredOnduty > 0 ? users?.filter(item => filteredOnduty.some(user => user.Id != item.user_id)) : users
        if (filteredUsers == undefined) {
            setFilteredOffDuty([])
        } else {
            setFilteredOffDuty(filteredUsers)
        }
    }, [filteredOnduty, users])

    useEffect(() => {
        if (!open) setOpenDrawer(true)
    }, [open, setOpenDrawer])

    return (
        <ModalLayout
            open={open}
            onClose={() => setOpen(false)}
            setOpen={setOpen}
            title={penugasan?.nama_bisnis}
        >
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Tabs
                        value={tab}
                        onChange={(event, newValue) => setTab(newValue)}
                    >
                        <Tab label="On duty" value={1} />
                        <Tab label="Off duty" value={2} />
                    </Tabs>
                    <div className={`rounded-full h-8 w-8 flex items-center justify-center ${tab == 1 ? 'bg-green-700' : 'bg-red-700'}`}>
                        <h3 className="inline-block text-white align-top">{tab == 1 ? filteredOnduty?.length : filteredOffDuty?.length}</h3>
                    </div>
                </div>
                <div className="h-[20vh] overflow-y-auto">
                    <table className="w-full">
                        <tbody>
                            {tab == 1 ?
                                (filteredOnduty?.map((data, i) => (
                                    <tr key={i}
                                        className="font-semibold text-left cursor-pointer rounded-2xl group hover:bg-gray-100"
                                        onClick={() => {
                                            handleClickGoToUser(data)
                                            setOpen(false)
                                        }}
                                    >
                                        <td className="p-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center justify-start gap-2">
                                                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                                    <h3 className="">{data?.Name}</h3>
                                                </div>
                                                <div className="px-2 py-1 leading-none bg-gray-200 rounded-md group-hover:bg-white">
                                                    <h3 className="">{users?.filter(item => item?.user_id == data.Id)[0]?.jabatan}</h3>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))) :
                                (filteredOffDuty?.map((data, i) => (
                                    <tr key={i}
                                        className="font-semibold text-left rounded-2xl group hover:bg-gray-100"
                                    >
                                        <td className="p-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center justify-start gap-2">
                                                    <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                                                    <h3 className="">{data?.full_name}</h3>
                                                </div>
                                                <div className="px-2 py-1 leading-none bg-gray-200 rounded-md group-hover:bg-white">
                                                    <h3 className="">{data.jabatan}</h3>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </ModalLayout >
    )
}

export default ModalPenugasanTracking
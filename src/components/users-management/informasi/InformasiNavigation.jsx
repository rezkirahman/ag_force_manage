import Transition from "@/components/transition"
import { Icon } from "@iconify/react"
import { Drawer, MenuItem, Tab, Tabs } from "@mui/material"
import { useRef, useEffect } from "react"

const menuProfiling = [
    {
        id: 1,
        title: 'Profil',
        icon: 'heroicons:building-office-2-16-solid'
    },
    {
        id: 2,
        title: 'Pribadi',
        icon: 'solar:user-bold'
    },
    {
        id: 3,
        title: 'Umum',
        icon: 'gg:menu-grid-o'
    },
    {
        id: 4,
        title: 'Legal',
        icon: 'fluent:wallet-credit-card-20-filled'
    },
    {
        id: 5,
        title: 'Kesehatan',
        icon: 'material-symbols:health-and-safety'
    },
    {
        id: 6,
        title: 'Pendidikan',
        icon: 'icon-park-solid:degree-hat'
    },
    {
        id: 7,
        title: 'Keluarga',
        icon: 'vaadin:family'
    },
    {
        id: 8,
        title: 'Pernikahan',
        icon: 'mdi:ring'
    },
    {
        id: 9,
        title: 'Kontak Darurat',
        icon: 'material-symbols:emergency-home'
    },
    {
        id: 10,
        title: 'Pelatihan',
        icon: 'material-symbols:sports-handball-rounded'
    },
    {
        id: 11,
        title: 'Keahlian',
        icon: 'mdi:puzzle'
    },
    {
        id: 12,
        title: 'Keagamaan',
        icon: 'mingcute:pray-fill'
    },
    {
        id: 13,
        title: 'Organisasi',
        icon: 'fa:group'
    },
    {
        id: 14,
        title: 'Pekerjaan',
        icon: 'ic:round-work'
    },
    {
        id: 15,
        title: 'Kegiatan',
        icon: 'solar:calendar-bold'
    },
    // {
    //     id: 16,
    //     title: 'Penugasan',
    //     icon: 'material-symbols:work-history-rounded'
    // },
    {
        id: 17,
        title: 'AGP',
        icon: 'fluent:handshake-32-filled'
    },
    // {
    //     id: 18,
    //     title: 'Informasi Login',
    //     icon: 'fluent:document-person-16-filled'
    // }

]

const InformasiNavigation = ({ selected, setSelected, openNavbar, setOpenNavbar }) => {

    return (
        <Transition>
            <div className="sr-only md:h-full w-fit md:not-sr-only">
                <div className="h-full p-4 bg-white rounded-2xl shadow-container">
                    <MenuRender
                        selected={selected}
                        setSelected={setSelected}
                        setOpenNavbar={setOpenNavbar}
                    />
                </div>
                <Drawer
                    anchor="right"
                    open={openNavbar}
                    onClose={() => setOpenNavbar(false)}
                >
                    <MenuRender
                        selected={selected}
                        setSelected={setSelected}
                        setOpenNavbar={setOpenNavbar}
                        showIcon
                    />
                </Drawer>
            </div>
        </Transition>
    )
}

export default InformasiNavigation

const MenuRender = ({ showIcon = false, selected, setSelected, setOpenNavbar }) => {
    return (
        <div className="flex flex-col w-[160px] h-full overflow-y-auto text-gray-600 md:gap-2 md:pr-2">
            {menuProfiling.map((item, i) => (
                <div key={i} className="flex items-center group">
                    <div className={`w-[1px] h-full rounded-full ${selected.id == item.id ? 'bg-primary' : 'group-hover:bg-gray-300'} `}></div>
                    <MenuItem
                        className={`${selected.id == item.id ? 'text-primary font-medium' : ''} flex items-center gap-1 rounded-r-xl w-full text-sm`}
                        onClick={() => {
                            setSelected(item)
                            setOpenNavbar(false)
                        }}
                    >
                        {showIcon && (
                            <div className="w-5">
                                <Icon icon={item.icon} className="" />
                            </div>
                        )}
                        <h3 className="">{item.title}</h3>
                    </MenuItem>
                </div>
            ))}
        </div>
    )
}


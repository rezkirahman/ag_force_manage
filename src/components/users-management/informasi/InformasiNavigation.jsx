import Transition from "@/components/transition"
import { Icon } from "@iconify/react"
import { Drawer, MenuItem } from "@mui/material"

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
    {
        id: 16,
        title: 'Penugasan',
        icon: 'material-symbols:work-history-rounded'
    },
    {
        id: 17,
        title: 'AGP',
        icon: 'fluent:handshake-32-filled'
    },
    {
        id: 18,
        title: 'Informasi Login',
        icon: 'fluent:document-person-16-filled'
    }

]

const InformasiNavigation = ({ selected, setSelected, openNavbar, setOpenNavbar }) => {
    const MenuRender = () => {
        return (
            <div className="flex flex-col h-full overflow-y-auto text-sm text-gray-600 md:gap-2 md:pr-2">
                {menuProfiling.map((item, i) => (
                    <MenuItem
                        key={i}
                        className={`${selected.id == item.id ? 'text-primary font-medium bg-primary/5' : ''} flex items-center gap-1 rounded-xl`}
                        onClick={() => {
                            setSelected(item)
                            setOpenNavbar(false)
                        }}
                    >
                        <div className="w-5">
                            <Icon icon={item.icon} className="text-sm" />
                        </div>
                        <h3 className="text-sm">{item.title}</h3>
                    </MenuItem>
                ))}
            </div>
        )
    }

    return (
        <Transition>
            <div className="sr-only md:h-full w-fit md:not-sr-only">
                <div className="h-full p-3 bg-white rounded-2xl shadow-container">
                    <MenuRender />
                </div>
                <Drawer
                    anchor="right"
                    open={openNavbar}
                    onClose={() => setOpenNavbar(false)}
                >
                    <MenuRender />
                </Drawer>
            </div>
        </Transition>
    )
}

export default InformasiNavigation


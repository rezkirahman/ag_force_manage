"use client"
import { createContext, useState, useContext, useEffect } from "react"

const AppContext = createContext({
    user: null
})


export function AppWrapper({ children }) {
    const [user, setUser] = useState(null)
    const [unitKerja, setUnitKerja] = useState('')
    const [suggestUnitKerja, setSuggestUnitKerja] = useState([])
    const [openSnackbar, setOpenSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    })

    useEffect(() => {
        setSuggestUnitKerja(user?.unit_kerja)
    }, [user])

    return (
        <AppContext.Provider
            value={{
                user,
                setUser,
                unitKerja,
                setUnitKerja,
                suggestUnitKerja,
                openSnackbar,
                setOpenSnackbar,
            }}
        >
            {children}
        </AppContext.Provider>
    )
}

export function useAppContext() {
    return useContext(AppContext)
}
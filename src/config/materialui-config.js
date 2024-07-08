import { createTheme } from "@mui/material";

export const theme = createTheme({
    palette: {
        primary: {
            main: '#00458E',
        },
    },
    typography: {
        fontFamily: 'var(--font-montserrat)',
        fontSize: 14,
    },
    components: {
        MuiInput: {
            styleOverrides: {
                input: {
                    fontSize: '14px',
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: '10px',
                },

            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: '50px',
                },
                sizeLarge: {
                    padding: '12px 24px',
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: '10px 10px 0 0',
                },
            },
        },
        MuiTabs: {
            styleOverrides: {
                indicator: {
                    borderRadius: '10px',
                    height: '2px',
                },
            },
        },
        MuiPopover: {
            styleOverrides: {
                paper: {
                    boxShadow: '0px 4px 20px 0px rgba(0,0,0,0.1)',
                },
            },
        },
        // MuiPaper: {
        //     styleOverrides: {
        //         root: {
        //             borderTopRightRadius: '20px',
        //             borderBottomRightRadius: '20px',
        //         },
        //     },
        // },
        MuiAutocomplete: {
            styleOverrides: {
                paper: {
                    boxShadow: '0px 4px 20px 0px rgba(0,0,0,0.1)',
                },
            },
        },
        MuiAlert: {
            styleOverrides: {
                root: {
                    borderRadius: '10px', // Set the border radius to 16px
                },
            },
        },
    },
})
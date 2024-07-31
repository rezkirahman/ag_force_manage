"use client"
import { Button, IconButton, InputAdornment, TextField, ThemeProvider } from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { signIn } from '@/api/auth'
import { Icon } from '@iconify/react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { theme } from '@/config/materialui-config'
import ErrorMessage from '@/components/ErrorMessage'
import nookies from 'nookies'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'

const Login = () => {
  const [loading, setLoading] = useState(false)
  const [phone, setPhone] = useState('')
  const [pin, setPin] = useState('')
  const [tab, setTab] = useState('phone')
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()
  const direction = tab === 'phone' ? 1 : -1
  const slideVariants = {
    initial: (direction) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0
    }),
    animate: {
      x: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 30, duration: 0.8 }
    },
    exit: (direction) => ({
      x: direction < 0 ? -1000 : 1000,
      opacity: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30, duration: 0.8 }
    }),
  }

  const handleLogin = useCallback(async () => {
    setLoading(true)
    setErrorMessage('')
    const response = await signIn(phone, pin)
    const isLogin = response?.data?.code == 200
    if (isLogin) {
      if (response?.data?.data) {
        nookies.set(null, 'access_token', response?.data?.data?.access_token)
        router.push('/dashboard')
      }
    } else {
      setPin('')
      setErrorMessage(response?.response?.data?.message?.description)
    }
    setLoading(false)
  }, [phone, pin, router])

  useEffect(() => {
    if (tab === 'phone') {
      setPin('')
    }
  }, [tab])

  useEffect(() => {
    const hasRefreshed = localStorage.getItem('hasRefreshed')
    if (!hasRefreshed) {
      localStorage.setItem('hasRefreshed', 'true')
      window.location.reload();
    }
  }, [])

  useEffect(() => {
    const access_token = nookies.get(null).access_token
    if (access_token) {
      router.push('/dashboard')
    }
  }, [router])

  return (
    <ThemeProvider theme={theme}>
      <div className="min-h-screen py-3 flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')]">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.75, ease: "easeInOut" }}
          className='w-[96%] md:w-[70%] xl:w-[50%] bg-white rounded-3xl shadow-container-dark py-4 px-8 md:py-8 md:px-16 flex flex-col text-gray-700 space-y-3 text-sm'
        >
          <div className='grow-0'>
            <Image
              alt='logo'
              src={'/logo.png'}
              width={500}
              height={500}
              className='w-auto h-16'
              priority
            />
          </div>
          <div className='h-full gap-10 transition-all lg:grid lg:grid-cols-2'>
            <div className='flex items-center justify-center'>
              <Image
                alt='logo'
                src={'/loginImage.png'}
                width={1000}
                height={1000}
                className='w-full h-auto sr-only lg:not-sr-only'
                priority
              />
            </div>
            <form onSubmit={(e) => {
              e.preventDefault()
              if (tab === 'phone') {
                setTab('pin')
              } else {
                handleLogin()
              }
            }}>
              <div className='flex flex-col justify-between h-full gap-6 overflow-clip'>
                <div className='flex items-center justify-between gap-4'>
                  <h3 className='text-xl font-semibold md:text-lg lg:text-xl whitespace-nowrap'>Selamat Datang</h3>
                  <div className={`${tab == 'phone' ? 'scale-0' : 'scale-100'} duration-300`}>
                    <IconButton
                      onClick={() => setTab('phone')}
                      color='primary'
                    >
                      <Icon icon={'eva:arrow-back-fill'} className='' />
                    </IconButton>
                  </div>
                </div>
                <ErrorMessage message={errorMessage} setMessage={setErrorMessage} />
                <div className='h-[100px]'>
                  {tab === 'phone' &&
                    <motion.div
                      key="phone"
                      custom={direction}
                      variants={slideVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      <PhoneForm phone={phone} setPhone={setPhone} />
                    </motion.div>
                  }
                  {tab === 'pin' &&
                    <motion.div
                      key={'pin'}
                      custom={direction}
                      variants={slideVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      <PINForm pin={pin} setPin={setPin} />
                    </motion.div>
                  }
                </div>
                <div className='space-y-4 transition-all'>
                  <Button
                    variant='contained'
                    className='bg-primary'
                    fullWidth
                    size='large'
                    disabled={loading}
                    type='submit'
                  >
                    {loading ? <Icon icon={'mingcute:loading-fill'} className='text-[26px] animate-spin' /> : 'Masuk'}
                  </Button>
                  <h3>Mengalami kendala? <Link href={'https://wa.me/+6282129819050'} target='_blank' className='font-semibold duration-150 cursor-pointer text-primary/70 hover:text-primary'>Hubungi Kami</Link></h3>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </ThemeProvider>
  )
}

export default Login

const PhoneForm = ({ phone, setPhone }) => {
  return (
    <div className='w-full space-y-1'>
      <h3 className='font-semibold'>No. Telepon</h3>
      <TextField
        variant="outlined"
        placeholder='81122334455'
        fullWidth
        value={phone}
        onChange={(e) => {
          const re = /^[0-9\b]+$/;
          if ((e.target.value === '' || re.test(e.target.value)) && e.target.value.length <= 15) {
            setPhone(e.target.value)
          }
        }}
        InputProps={{
          startAdornment: <InputAdornment position="start">+62</InputAdornment>,
        }}
      />
    </div>
  )
}

const PINForm = ({ pin, setPin }) => {
  const firstInputRef = useRef(null);

  useEffect(() => {
    // Focus the first input slot when the component mounts
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, []);
  return (
    <div className='mx-auto space-y-1 w-fit'>
      <h3 className='font-semibold'>PIN</h3>
      <InputOTP
        maxLength={6}
        value={pin}
        onChange={(e) => setPin(e)}
      >
        <InputOTPGroup className={'font-semibold'}>
          <InputOTPSlot index={0} ref={firstInputRef} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
    </div>
  )
}
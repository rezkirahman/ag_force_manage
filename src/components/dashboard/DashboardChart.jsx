import { Line } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    LineController,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js'
ChartJS.register(
    LineController,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
)
import { adjustAlphaColor } from '@/helper/adjustAlphaColor'

const DashboardChart = ({ label = [], data = [], color='rgba(29, 28, 227, 1)' }) => {
    return (
        < div className='h-[300px] w-full' >
            <Line // Change Bar to Line
                data={{
                    labels: label,
                    datasets: [
                        {
                            // label: 'Warga Lama',
                            data: data,
                            backgroundColor: adjustAlphaColor(color, 0.1),
                            borderColor: color,
                            borderWidth: 4,
                            borderRadius: 16,
                            tension: 0.5,
                            fill: true,
                            pointStyle: 'circle',
                        },
                    ]
                }}
                options={{
                    plugins: {
                        legend: {
                            display: false,
                            labels: {
                                usePointStyle: true,
                                padding: 40,
                            },
                        },
                        tooltip: {
                            enabled: true,
                            backgroundColor: 'white',
                            titleColor: '#9ca3af',
                            bodyColor: '#9ca3af',
                            borderColor: '#e5e7eb',
                            borderWidth: 1,
                            padding: 16,
                            mode: 'index',
                            intersect: false,
                        },
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                    filler: {
                        propagate: true,
                    },
                    scales: {
                        x: {
                            grid: {
                                display: false,
                            },
                            ticks: {
                                display: true,
                                color: '#4b5563',
                                fontWidth: 800,
                            },
                            border: {
                                color: 'transparent',
                            },
                        },
                        y: {
                            ticks: {
                                display: true,
                                color: '#4b5563',
                            },
                            grid: {
                                display: false,
                                color: '#4b5563',
                            },
                            border: {
                                color: 'transparent',
                            },
                        },
                    },
                }}
            />
        </div >
    )
}

export default DashboardChart

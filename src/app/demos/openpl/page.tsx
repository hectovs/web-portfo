"use client"

import { NextFetchEvent } from "next/server"
import {useCallback, useEffect, useMemo, useRef, useState} from "react"
import  Papa  from "papaparse"
import { Doughnut, Scatter } from "react-chartjs-2"
import 'chartjs-adapter-date-fns';
import zoomPlugin from "chartjs-plugin-zoom"
import { Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    TimeScale, 
    Title,
    Tooltip,
    Legend,
    ChartData, 
    ChartOptions,
    DatasetChartOptions,
    ScatterController,
} from 'chart.js'


ChartJS.register(ArcElement, CategoryScale, LineElement, LinearScale, PointElement, TimeScale, Title, Tooltip, Legend, zoomPlugin)

export default function openPl(){

    const scatterRef = useRef<ChartJS<"scatter">>(null)
    const doughnutRef = useRef<ChartJS<"doughnut">>(null)

    const [data, setData] = useState<object[]>([])

    const [doughnutData, setDoughnutData] = useState<ChartData<"doughnut">>({ 
        labels: ["Attempts Made", "Attempts Missed"],
        datasets:[]
    })
    const [isLoading, setLoading] = useState<boolean>(false)
    const [lifter, setLifter] = useState<string>("hectorvansmirren")
    const [lifterInput, setLifterInput] = useState<string>("hectorvansmirren")
    const [local, setLocal] = useState<boolean>(true) //true means local instance of openpowerlifting is accessed 
    const [scatterOptions, setScatterOptions] = useState<ChartOptions<"scatter">>({
        responsive: true, 
        showLine: true, 
        plugins: { 
            legend : { 
                position: 'top'
            }, 
            title: { 
                display:true, 
                text: 'Lifts and Total over Time'
            },
            zoom: {
                pan:{
                    enabled: true,
                    mode: "xy"
                },
                zoom: {
                  wheel: {
                    enabled: true,
                  },
                  pinch: {
                    enabled: true
                  },
                  mode: 'x',
                }
            }
        }, 
        scales:{ 
            x: { 
                type : 'time', 
                position: 'bottom', 
                title : {
                    display: true,
                    align: 'center',
                    text: 'Time'
                },

            }, 
            y:{
                beginAtZero: true,
                type: 'linear',
                title:{
                    display: true,
                    align: 'center',
                    text: 'Mass (kg)'
                }, 
                ticks: { 
                    stepSize: 25, 
                }
            }
        }
    })
    const [scatterData, setScatterData] = useState<ChartData<"scatter">>({
        datasets:[]
    })

    const [successMetricLifts, setSuccessMetricLifts ] = useState<string[]>([
        "Squat1Kg", "Squat2Kg", "Squat3Kg",
        "Bench1Kg", "Bench2Kg", "Bench3Kg", 
        "Deadlift1Kg", "Deadlift2Kg", "Deadlift3Kg", 
    ]) 

   
    useEffect(() => {
      setLoading(true)
      fetch("/api/lifterscsv/" + lifter)
      .then((res) => res.text())
      .then((data)=>{
        const oplJson = Papa.parse(data, {header: true})
        console.log(oplJson)
        setData(oplJson.data)
      })
      setLoading(false)
    }, [lifter])

    useCallback(()=>{
        setLifter(lifterInput)
    },[lifter])

    useMemo(()=>{
        //transforms data into scatterData
        let newScatterData : ChartData<"scatter"> = {
            datasets: []
            
        }; 
        var totalDataset =  { 
            label: 'Total',
            borderColor: "rgb(0, 255, 0)",
            data:[]
        }
        var squatDataset = { 
            label: 'Squat',
            borderColor: "rgb(255, 0, 0)",
            data:[]
        }
        var benchDataset = {
            label: 'Bench',
            borderColor: "rgb(0, 0, 255)",
            data:[]
        }
        var deadliftDataset = { 
            label: 'Deadlift',
            borderColor: "rgb(0, 255, 255)",
            data:[]
        }
        var dotsDataset = {
            label: 'Dots',
            borderColor: "rgb(255, 255, 0)",
            data:[]
        }
        if(data.length > 0 ){
            data.forEach((meet)=>{
                const utc = Date.parse(meet["Date"])
                if("TotalKg" in meet){
                    totalDataset["data"].push({y:meet["TotalKg"], x: utc})
                    squatDataset["data"].push({y:meet["Best3SquatKg"], x:utc})
                    benchDataset["data"].push({y:meet["Best3BenchKg"], x:utc})
                    deadliftDataset["data"].push({y:meet["Best3DeadliftKg"], x:utc})
                    dotsDataset["data"].push({y:meet["Dots"], x:utc})
                }
            })
        }

        newScatterData.datasets.push(totalDataset, squatDataset, benchDataset, deadliftDataset, dotsDataset)
        console.log(newScatterData)
        setScatterData(newScatterData)
    },[data])

    useMemo(()=>{
        var attemptsMade : number = 0 
        var attemptsMissed : number = 0

        var newDoughnutDataset = {
            backgroundColor: ["rgb(0, 255, 0)","rgb(255, 0, 0)" ],
            borderColor: ["rgb(0, 255, 0)","rgb(255, 0, 0)" ],
            label: "Number of Lifts ",
            data: [0,0],
        }
        
        
        if(data.length > 0 && successMetricLifts.length > 0 ){
            data.forEach((meet)=>{
                successMetricLifts.forEach((lift)=>{
                    if(lift in meet){
                        if(meet[lift] > 0 ){
                            attemptsMade++
                        } else { 
                            attemptsMissed++
                        }
                    }
                })
            })
        }

        newDoughnutDataset["data"] = [attemptsMade, attemptsMissed]
        
        setDoughnutData({...doughnutData, "datasets": [newDoughnutDataset]})

    },[successMetricLifts, data])
    
    //TODO CSS to put resetZoom button in a good place and work with screen resizes 
    //TODO write a rust wasm to do the curve fit and therefore projection into the future based on dots 
    
    if (isLoading) return <p>Loading...</p>
    if (!data) return <p>No profile data</p>
    
    function resetZoom(){ 
        if(scatterRef.current){
            scatterRef.current.resetZoom()
        }
    }

    return(
        <div>
            <div className="w-full py-2 px-4 flex flex-row relative">
                <div className="w-1/2 left-0 flex relative">
                    <div className="grow absolute top-0 right-0 py-6">
                        <button onClick={resetZoom} className="absolute top-0 right-0 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-2 border border-blue-500 hover:border-transparent rounded">
                            Reset Zoom 
                        </button>
                    </div>
                    <div className="w-full">
                        <Scatter ref={scatterRef} data={scatterData} options={scatterOptions} />
                    </div>
                </div>
                <div className="w-1/2 h-[50vh] flex justify-center" >
                    <Doughnut className="right-0 h-[50vh]" ref={doughnutRef} data={doughnutData} />
                </div>
            </div>

            <div className="w-full max-w-xs py-2 px-4">
                <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" value={lifterInput} onChange={(event)=>{setLifterInput(event.target.value)}} />
                <div className="py-2">
                    <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded" onClick={()=>{setLifter(lifterInput)}}>
                        Update Lifter Data
                    </button> 
                </div>
            </div>
        </div>
    )
}
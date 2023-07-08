"use client"

import { NextFetchEvent } from "next/server"
import {useCallback, useEffect, useMemo, useState} from "react"
import  Papa  from "papaparse"
import { Line, Scatter } from "react-chartjs-2"
import 'chartjs-adapter-date-fns';
import { Chart as ChartJS,
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
} from 'chart.js'
import { ObjectLiteralExpressionBase, TaggedTemplateExpression } from "typescript"

ChartJS.register(CategoryScale, LineElement, LinearScale, PointElement, TimeScale, Title, Tooltip, Legend, )

export default function openPl(){

    const [lifter, setLifter] = useState<string>("hectorvansmirren")
    const [lifterInput, setLifterInput] = useState<string>("hectorvansmirren")
    const [local, setLocal] = useState<boolean>(true) //true means local instance of openpowerlifting is accessed 
    const [data, setData] = useState<object[]>([])
    const [isLoading, setLoading] = useState<boolean>(false)
    const [chartOptions, setChartOptions] = useState<ChartOptions<"scatter">>({
        responsive: true, 
        showLine: true, 
        plugins: { 
            legend : { 
                position: 'top'
            }, 
            title: { 
                display:true, 
                text: 'Lifts and Total over Time'
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
    const [chartData, setChartData] = useState<ChartData<"scatter">>({
        datasets:[]
    })

   
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
        //transforms data into chartData
        let newChartData : ChartData<"scatter"> = {
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

        newChartData.datasets.push(totalDataset, squatDataset, benchDataset, deadliftDataset, dotsDataset)
        console.log(newChartData)
        setChartData(newChartData)
    },[data])
    
    //TODO write a rust wasm to do the curve fit and therefore projection into the future based on dots 
    
    if (isLoading) return <p>Loading...</p>
    if (!data) return <p>No profile data</p>
    
    return(
        <div>
            <input className="" type="text" value={lifterInput} onChange={(event)=>{setLifterInput(event.target.value)}}/>
            <button onClick={()=>{setLifter(lifterInput)}}>Update Lifter Data</button> 
            <Scatter data={chartData} options={chartOptions} />
        </div>
    )
}
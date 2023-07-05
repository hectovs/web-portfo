"use client"

import { NextFetchEvent } from "next/server"
import {useEffect, useMemo, useState} from "react"
import  Papa  from "papaparse"

export default function openPl(){

    const [lifter, setLifter] = useState("hectorvansmirren")
    const [local, setLocal] = useState(true) //true means local instance of openpowerlifting is accessed 
    const [data, setData] = useState(null)
    const [isLoading, setLoading] = useState(false)
   
    useEffect(() => {
      setLoading(true)
      fetch("/api/lifterscsv/" + lifter)
      .then((res) => res.text())
      .then((data)=>{
        console.log(data)
        const oplJson = Papa.parse(data, {header: true})
        setData(oplJson)
      })
      setLoading(false)
    }, [lifter])
   
    if (isLoading) return <p>Loading...</p>
    if (!data) return <p>No profile data</p>
    //TODO get the csv from the openpowerlifting api 
    //TODO parse the csv into the chart 
    //TODO write a rust wasm to do the curve fit and therefore projection into the future based on dots 
    //TODO work backwards to total and lifts from previous percentages
    //TODO we need to import a charting package 
    //TODO we need to use the charting package 

    return(
        <div>
            <input className="" type="text" value={lifter}/>
                           

        </div>
    )
}
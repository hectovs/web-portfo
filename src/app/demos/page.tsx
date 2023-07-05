"use client"

import { useEffect, useState } from "react"
import DemoRow from "../components/demo-row"

export default function Demos(){
    const [demos, setdemos] = useState([
        {
            "id" : 1, 
            "name" : "DeckGL Map",
            "description" : "A DeckGL map that uses openstreetmap layers",
            "uri": "deckgl",
        },
        {
            "id" : 2, 
            "name" : "Powerlifting Analysis",
            "description" : "A page that allows you to analyse the performance of athletes at various points",
            "uri" : "openpl"
        }
    ])
    const [availableColumns, setAvailableColumns] = useState([])
    const [displayColumns, setDisplayColumns] = useState([
        {
            display: "Name",
            inJson: "name"
        },
        {
            display:"Description",
            inJson: "language"
        },
        {
            display:"Link",
            inJson: "uri"
        }
    ])



    useEffect(() => { 
        

    }, [])


    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
                <table className="table-auto w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            {
                                displayColumns.map((col)=>{ 
                                    return(
                                        <th scope="col" key={col["display"]}>
                                            {col["display"]}
                                        </th>
                                    )
                                })
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            demos.map((demo)=>{
                                return(
                                    <DemoRow key={demo["id"]} columns={displayColumns} demo={demo} />
                                    )
                                })
                        }
                    </tbody>
                </table>
            </div>
        </main>
    )
}
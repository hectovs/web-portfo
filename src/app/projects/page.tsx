"use client"

import { useEffect, useState } from "react"
import ProjectRow from "../components/project-row"



export default function Projects(){
    const [projects, setProjects] = useState([])
    const [availableColumns, setAvailableColumns] = useState([])
    const [displayColumns, setDisplayColumns] = useState([
        {
            display: "Name",
            inJson: "name"
        },
        {
            display:"Language",
            inJson: "language"
        },
        {
            display:"Github",
            inJson: "html_url"
        }
    ])

    useEffect(() => { 
        fetch("https://api.github.com/users/hectovs/repos")
            .then(response => response.json())
            .then((data)=> {
                console.log(data)
                setProjects(data)
                
            })

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
                            projects.map((project)=>{
                                return(
                                    <ProjectRow key={project["id"]} columns={displayColumns} project={project} />
                                    )
                                })
                        }
                    </tbody>
                </table>
            </div>
        </main>
    )
}
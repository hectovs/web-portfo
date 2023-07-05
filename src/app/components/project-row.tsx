export default function ProjectRow({columns, project }:{columns: Array<{"inJson" :string, "display": string}>, project: {"id":number}}){
    return ( 
        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            {
                columns.map((col) => {
                    if(col["inJson"] =="html_url"){
                        return(
                            <td className="text-blue-400" key={project["id"].toString() + col["display"]}>
                                <u>
                                    <a href={project[col["inJson"]]} >Link</a>
                                </u>
                            </td>

                        )
                    } 
                    return( 
                        <td key={project["id"].toString() + col["display"]} >
                            {project[col["inJson"]]}
                        </td>
                    )
                })
            }
        </tr>
        
    )
}

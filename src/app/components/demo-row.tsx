export default function DemoRow({columns, demo }:{columns: Array<{"inJson" :string, "display": string}>, demo: {"name": string, "description": string}}){
    return ( 
        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            {
                columns.map((col) => {
                    return(
                        <td className="text-blue-400" key={demo["id"].toString() + col["display"]}>
                            <u>
                                <a href={"demos/" + demo["uri"]}>{demo["name"]}</a>
                            </u>
                        </td>
                    )
                })
            }
        </tr>
        
    )
}

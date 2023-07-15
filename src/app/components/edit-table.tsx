export default function EditTable({data, columns} : {data : object[], columns :object[]}) {
    
    
    return (
        <table className="table-auto border px-8 py-4 overflow-scroll w-1/2">
            <thead className="w-full">
                <tr className="w-full">
                    {
                        columns.map((column : object) => {
                            return( 
                                <th className="bg-blue-100 border text-left px-2 py-4">{column["displayName"]}</th>
                            )

                        })
                    }
                </tr>
            </thead>
            <tbody className="w-full">
                {
                    data.map((datum : object) => { 
                        var hasAllCols = columns.every(column => Object.keys(datum).includes(column["jsonKey"]))
                        if(hasAllCols){
                            return(
                                <tr className="w-full">
                                    {
                                        columns.map((column: object)=>{
                                            return(
                                                <td className="border">
                                                    <input  className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline " type="text" value={datum[column["jsonKey"]]}/>
                                                </td>
                                            )
                                        })
                                    }
                                </tr>
                            )
                        }
                    })
                }
            </tbody>
        </table>
    )
}
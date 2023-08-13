import { useState } from "react";

export default function EditTable({data, columns, update_data} : {data : object[], columns :object[],
    update_data:(value: null | object[] | ((prevState: null | object[]) => null | object[])) => void;}) {
    
    const [inputRow, setInputRow] = useState<object>({})

    //JSON once an input row is constructed allow this to be added to the json data  


    
    
    return (
        <div>
            <table className="table-auto border px-8 py-4 overflow-scroll w-1/2">
                <thead className="w-full">
                    <tr className="w-full">
                        {
                            columns.map((column : object, column_index:number) => {
                                return( 
                                    <th className="bg-blue-100 border text-left px-2 py-4" key={"header_column" + column_index}>{column["displayName"]}</th>
                                )

                            })
                        }
                    </tr>
                </thead>
                <tbody className="w-full">
                    {
                        data.map((datum : object, data_index: number ) => { 
                            var hasAllCols = columns.every(column => Object.keys(datum).includes(column["jsonKey"]))
                            if(hasAllCols){
                                return(
                                    <tr className="w-full" key={"row"+data_index}>
                                        {
                                            columns.map((column: object, column_index: number )=>{
                                                return(
                                                    <td className="border" key={"data" + data_index + "column" + column_index}>
                                                        <input  className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100"   type="text" readOnly value={datum[column["jsonKey"]]}/>
                                                    </td>
                                                )
                                            })
                                        }
                                    </tr>
                                )
                            }
                        })
                    }
                    <tr className="w-full">
                        {
                            columns.map((column:object, column_index:number)=>{
                                return(
                                    <td key={"column" + column_index}>
                                        <input  className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text"  value={inputRow["jsonKey"]} onChange={(event)=>{setInputRow({...inputRow, [column["jsonKey"]]:event.target.value })}}/>
                                    </td>
                                )
                            })
                        }
                    </tr>
                </tbody>
            </table>
            <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded" onClick={()=>{
                console.log(inputRow)
                update_data([...data, inputRow])
            }}>
                Add row 
            </button> 
        </div>
    )
}
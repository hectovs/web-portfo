import { useState } from "react";

export default function EditTable({ data, columns, update_data }: {
    data: object[], columns: object[],
    update_data: (value: null | object[] | ((prevState: null | object[]) => null | object[])) => void;
}) {

    const [inputRow, setInputRow] = useState<object>({})

    //JSON once an input row is constructed allow this to be added to the json data  




    return (
        <table className="table-fixed border px-8 py-4 w-full h-1/4">
            <thead className="">
                <tr className="">
                    {
                        columns.map((column: object, column_index: number) => {
                            return (
                                <th className="bg-blue-100 border text-left px-2 py-4 w-1/10" key={"header_column" + column_index}>{column["displayName"]}</th>
                            )

                        })
                    }
                    <th className="bg-blue-100 border text-left px-2 py-4" key={"header_column" + "actions"}>Actions</th>
                </tr>
            </thead>
            <tbody className="">
                {
                    data.map((datum: object, data_index: number) => {
                        var hasAllCols = columns.every(column => Object.keys(datum).includes(column["jsonKey"]))
                        if (hasAllCols) {
                            return (
                                <tr className="" key={"row" + data_index}>
                                    {
                                        columns.map((column: object, column_index: number) => {
                                            return (
                                                <td className="border w-1/10" key={"data" + data_index + "column" + column_index}>
                                                    <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-gray-100 w-full" type="text" readOnly value={datum[column["jsonKey"]]} />
                                                </td>
                                            )
                                        })
                                    }
                                    <td className="border" key={"data" + data_index + "column" + "actions"}>
                                        <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded" onClick={() => {
                                            let newData = data
                                            newData.splice(data_index, 1)
                                            update_data([...newData])
                                        }}>
                                            Remove
                                        </button>
                                    </td>

                                </tr>
                            )
                        }
                    })
                }
                <tr className="">
                    {
                        columns.map((column: object, column_index: number) => {
                            return (
                                <td className="border" key={"column" + column_index}>
                                    <input className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" value={inputRow["jsonKey"]} onChange={(event) => { setInputRow({ ...inputRow, [column["jsonKey"]]: event.target.value }) }} />
                                </td>
                            )
                        })
                    }
                    <td className="border" key={"column" + "actions"}>
                        <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded" onClick={() => {
                            console.log(inputRow)
                            let newData = [...data, inputRow].sort((a,b)=>Date.parse(a["Date"]) - Date.parse(b["Date"]))
                            update_data(newData)
                        }}>
                            Add
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>

    )
}
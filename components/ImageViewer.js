import React, { useEffect, useState } from "react";
import { myQuery } from "@/queries";



const ImageViewer = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false)

    const loadUploadedData = async () => {
        setLoading(true)
        const query = myQuery();
        const results = await query.search("irys:transactions").tags([{ name: "application-name", values: ["image-album"] }]);
        console.log("the result of the transactions: ", results)
        setData(results);
        setLoading(false);
    }

    useEffect(() => {
        loadUploadedData()
    }, [])



    if (loading) {
        return <div>Loading...........</div>
    }

    return <div className="flex flex-wrap">
        {data &&
            data.map(({ tags, id, }) => (
                <div className="w-1/5 p-4" key={id}>
                    <img src={`https://arweave.net/${id}`} className="w-full h-auto rounded" />

                    {tags.map(({ name, value }) => {
                        if (name == "caption") {
                            return <h3 className="mt-2 text-lg font-semibold">{value}</h3>
                        } else if (name == "description") {
                            return <p className="text-gray-500">{value}</p>
                        }
                    })}
                </div>
            ))}
    </div>
}



export default ImageViewer
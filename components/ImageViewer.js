import React from "react";
import { GetUploadedImages } from "../graphql/queries";
import { useQuery } from "@apollo/client";

const ImageViewer = () => {

    const { loading, error, data } = useQuery(GetUploadedImages, {
        variables: {
            tags: [{ name: "application-name", values: ["image-album"] }],
        },
    });

    if (error) {
        return <div>Error Displaying Images</div>
    }

    if (loading) {
        return <div>Loading...........</div>
    }

    console.log("data ", data.transactions.edges)

    return <div className="flex flex-wrap">
        {data &&
            data.transactions.edges.map(({ node }) => (
                <div className="w-1/5 p-4" key={node.id}>
                    <img src={`https://arweave.net/${node.id}`} className="w-full h-auto rounded" />

                    {node.tags.map(({ name, value }) => {
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
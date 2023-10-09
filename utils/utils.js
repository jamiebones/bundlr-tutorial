import * as fs from "fs";
import Irys from "@irys/sdk";


const { Private_Key } = process.env;

const getirysClient = () => {
    const irys = new Irys({
        url: "https://devnet.irys.xyz",
        token: "matic",
        key: Private_Key,
        config: {
            providerUrl: "https://rpc-mumbai.maticvigil.com",
        }
    });
    // Print your wallet address
    console.log(`wallet address = ${irys.address}`);
    return irys;
};

export const lazyFundNode = async (size) => {
    const irys = getirysClient();
    const price = await irys.getPrice(size);
    await irys.fund(price);
};

export const uploadFileToArweave = async (filepath, tags) => {
    const irys = getirysClient();
    const file = fs.readFileSync(filepath);
    const { id } = await irys.upload(file, { tags });
    console.log("file uploaded to ", `https://arweave.net/${id}`);
    return id;
};

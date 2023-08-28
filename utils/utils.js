import * as fs from "fs";
import Bundlr from "@bundlr-network/client";


const { kty, n, e, d, p, q, dp, dq, qi, Private_Key } = process.env;

const getBundlrClient = () => {
    const bundlr = new Bundlr(
        "https://devnet.bundlr.network",
        "matic",
        Private_Key,
        {
            providerUrl: "https://rpc-mumbai.maticvigil.com",
        }
    );
    // Print your wallet address
    console.log(`wallet address = ${bundlr.address}`);
    return bundlr;
};

export const lazyFundNode = async (size) => {
    const bundlr = getBundlrClient();
    const price = await bundlr.getPrice(size);
    await bundlr.fund(price);
};

export const uploadFileToArweave = async (filepath, tags) => {
    const bundlr = getBundlrClient();
    const file = fs.readFileSync(filepath);
    const { id } = await bundlr.uploadWithReceipt(file, { tags });
    console.log("file uploaded to ", `https://arweave.net/${id}`);
    return id;
};

import Query from "@irys/query";

export const myQuery = () => {
    const myQuery = new Query({ url: "https://devnet.irys.xyz/graphql" });
    return myQuery;
}

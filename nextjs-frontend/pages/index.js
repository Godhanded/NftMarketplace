import NFTBox from "@/components/NFTBox"
import { useQuery } from "@apollo/client"
import GET_ACTIVE_ITEMS from "@/constants/subGraphQueries"
import { useAccount } from "wagmi"

export default function Home() {
    const { isConnected } = useAccount()
    const { loading, error, data:listedItems } = useQuery(GET_ACTIVE_ITEMS)
    return (
        <div className="container mx-auto">
            <h1 className="py-4 px-4 font-bold text-2xl">Recently Listed</h1>
            {isConnected ? (
                <div className="flex flex-row flex-wrap gap-5 mt-7 ml-4">
                    {loading || !listedItems ? (
                        <div className="flex justify-center my-[25%] ">loading...</div>
                    ) : (
                        listedItems.activeItems.map((nft) => {
                            const { price, nftAddress, tokenId, seller } = nft
                            return (
                                <NFTBox
                                    price={price}
                                    tokenId={tokenId}
                                    nftAddress={nftAddress}
                                    seller={seller}
                                    key={`${nftAddress}${tokenId}`}
                                />
                            )
                        })
                    )}
                </div>
            ) : (
                <div>Web3 Currently not Enabled: connect wallet</div>
            )}
        </div>
    )
}

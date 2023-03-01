import NFTBox from "@/components/NFTBox"
import { useAccount } from "wagmi"

export default function Home() {

    let listedItems=[{tokenId:0,nftAddress:"0x000002",seller:"0x0093984",price:100},{tokenId:1,nftAddress:"0x000004343",seller:"0x00933984",price:200}]
    const{isConnected}=useAccount()
    return (<div className="container mx-auto">
        <h1 className="py-4 px-4 font-bold text-2xl">Recently Listed</h1>
        {!isConnected? 
    <div className="flex flex-row flex-wrap gap-5 mt-7 ml-4">
               { !listedItems? <div className="flex justify-center my-[25%] ">loading...</div>:listedItems.map(nft=>{
                    const {price,nftAddress,tokenId,seller}=nft
                    return(
                    <NFTBox
                        price={price}
                        tokenId={tokenId}
                        nftAddress={nftAddress}
                        seller={seller}
                        key={`${nftAddress}${tokenId}`}
                    />)
                    
               })  }
        </div>:<div>Web3 Currently not Enabled: connect wallet</div>}</div>)
}

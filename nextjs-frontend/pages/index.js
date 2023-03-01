import NFTBox from "@/components/NFTBox"

export default function Home() {

    let listedItems=[{tokenId:0,nftAddress:"0x000002",seller:"0x0093984",price:100},{tokenId:1,nftAddress:"0x000004343",seller:"0x00933984",price:200}]

    return (<div key={"home"} className="flex flex-row gap-5">
               { !listedItems? <div className="flex justify-center my-[25%] ">loading...</div>:listedItems.map(nft=>{
                    const {price,nftAddress,tokenId,seller}=nft
                    return <div>
                    <NFTBox
                        price={price}
                        tokenId={tokenId}
                        nftAddress={nftAddress}
                        seller={seller}
                        key={`${nftAddress}${tokenId}`}
                    />
                    </div>
               })  }
        </div>)
}

import { useEffect, useState } from "react";
import { useContractRead } from "wagmi";
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import nftAbi from "../constants/MockNft.json"
import Card from "./Card"
import Image from "next/image"
import { ethers } from "ethers";

export default function NFTBox({price,nftAddress,seller,tokenId}){
    const [imageURI,setImageURI]=useState("")
    const [tokendata,setTokenData] =useState({name:"",description:""})
    const getUri=useContractRead({
        abi:nftAbi,
        address:nftAddress,
        functionName:"tokenURI",
        args:[tokenId],
        enabled:false
    })
    async function updateUI(){
        const tokenURI= await getUri().data
        if(tokenURI){
            // ipfs gate way ipfs not supported browser
            const requestUrl= tokenURI.replace("ipfs://","https://ipfs.io/ipfs/")
            const tokenUriResopnse=await (await fetch(requestUrl)).json()
            const imageUri=tokenUriResopnse.image
            const newImageUrl= imageUri.replace("ipfs://","https://ipfs.io/ipfs/")
            setImageURI(newImageUrl)
            setTokenData({name:tokenUriResopnse.name,description:tokenUriResopnse.description})
        }
    }
console.log("boxed..")
    // useEffect(()=>{
    //     updateUI()
    // },[])

    return (
        <div>
            <div>
                {imageURI? <Card tokenId={tokenId} title={tokendata.name} description={tokendata.description} price={`${ethers.utils.formatUnits(price,"ether")} ETH`}>
                    <div className="italic text-sm">Owned by {seller}</div>
                    <Image
                    loader={()=>imageURI}
                    src={imageURI}
                    height="200"
                    width="200"
                    />
                </Card>: <div>loading...</div>}
            </div>
        </div>
    )
}
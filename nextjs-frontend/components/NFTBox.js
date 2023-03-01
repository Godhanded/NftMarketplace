import { useEffect, useState } from "react";
import { useContractRead,useAccount } from "wagmi";
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import nftAbi from "../constants/MockNft.json"
import Card from "./Card"
import Image from "next/image"
import { ethers } from "ethers";

const truncateStr=(fullStr,strLen)=>{
    if (fullStr.length <= strLen) return fullStr

    const seperator="..."
    const charsToShow= strLen - seperator.length
    const frontChars= Math.ceil(charsToShow/2)
    const backChars = Math.floor(charsToShow/2)
    return fullStr.subString(0,frontChars)+seperator+fullStr.subString(fullStr.length-backChars)
}


export default function NFTBox({price,nftAddress,seller,tokenId}){
    const [imageURI,setImageURI]=useState("")
    const [tokenData,setTokenData] =useState({name:"",description:""})
    const getUri=useContractRead({
        abi:nftAbi,
        address:nftAddress,
        functionName:"tokenURI",
        args:[tokenId],
        enabled:false
    })

    const {isConnected,address}=useAccount()
    async function updateUI(){
        const tokenURI= getUri?.data
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
    useEffect(()=>{
        updateUI()
    },[isConnected])


    const isOwnedByUser= seller===address ||seller==undefined
    const fromatedSellerAddress= isOwnedByUser? "you": truncateStr(seller || "",15)

    return (
        
            <div>
                {!imageURI? <Card tokenId={tokenId} title={tokenData.name} description={tokenData.description} price={`${ethers.utils.formatUnits(price,"ether")} ETH`}>
                    <div className="italic text-sm">Owned by {fromatedSellerAddress}</div>
                    <Image
                    className="mx-auto"
                    loader={()=>imageURI}
                    src={imageURI}
                    alt={tokenData.name}
                    height="200"
                    width="200"
                    />
                </Card>: <div>loading...</div>}
            </div>
        
    )
}
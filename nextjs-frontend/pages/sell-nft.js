import { Form, useNotification } from "@web3uikit/core"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import nftMarketAddress from "../constants/contractAddresses.json"
import nftAbi from "../constants/MockNft.json"
import { useContractWrite, useWaitForTransaction } from "wagmi"
import { useState,useEffect } from "react"
import { ethers } from "ethers"

export default function Home() {
    const dispatch = useNotification()
    const [nftArgs,setNftArgs]=useState({nftAddress:"",tokenId:"",price:""})
    const { write:listWrite } = useContractWrite({
        mode: "recklesslyUnprepared",
        abi: nftMarketplaceAbi,
        address: nftMarketAddress[5]["NftMarketplace"][0],
        functionName: "listItem",
        args: [nftArgs.nftAddress, nftArgs.tokenId, nftArgs.price],

        onSuccess(tx) {
            handleListSuccess()
        },
    })
    function handleApproveSuccess() {
        
        listWrite?.()
    }

    const { write,data } = useContractWrite({
        mode: "recklesslyUnprepared",
        abi: nftAbi,
        address:nftArgs.nftAddress,
        functionName: "approve",
        args: [nftMarketAddress[5]["NftMarketplace"][0], nftArgs.tokenId],
        
    })
    const {isSuccess,isLoading}=useWaitForTransaction({
        hash:data?.hash
    })
    function approveAndList(data) {
        const nftAddress = data.data[0].inputResult
        
        const tokenId = data.data[1].inputResult
        const price = ethers.utils.parseEther(`${data.data[2].inputResult}`).toString()
        setNftArgs({nftAddress:nftAddress,tokenId:tokenId,price:price})        
    }
useEffect(()=>{
    if(nftArgs.nftAddress && !isSuccess && !isLoading) {
        write?.()
    }
    if(isSuccess) handleApproveSuccess()
    
},[nftArgs,isSuccess])

    function handleListSuccess() {
        dispatch({
            type: "success",
            title: "NFT Listed",
            message: "NFT Listing",
            position: "topR",
        })
    }
    return (
        <div>
            
            <Form
                onSubmit={approveAndList}
                data={[
                    {
                        name: "Nft Address",
                        type: "text",
                        inputWidth: "50%",
                        value: "",
                        key: "nftAddress",
                    },
                    {
                        name: "Token ID",
                        type: "number",
                        value: "",
                        key: "tokenId",
                    },
                    {
                        name: "Price in ETH",
                        type: "number",
                        value: "",
                        key: "price",
                    },
                ]}
                title="Sell your NFT"
                id="Main Form"
            />
        </div>
    )
}

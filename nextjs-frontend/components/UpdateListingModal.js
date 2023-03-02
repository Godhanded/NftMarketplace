import { Modal,Input } from "@web3uikit/core"
import { writeContract } from "@wagmi/core"
import { usePrepareContractWrite,useContractWrite } from "wagmi"
import { useState } from "react"
import nftMarketplaceAbi from "../constants/NftMarketplace.json"
import nftMarketAddress from "../constants/contractAddresses.json"
import {ethers} from "ethers"

export default function UpdateListingModal({nftAddress,tokenId,isVisible,onClose}){
     const [priceToUpdateListing,setPriceToUpdateListing]=useState(0)
    
     const {error,config,isError}=usePrepareContractWrite({
        address:nftMarketAddress[5]["NftMarketplace"],
        abi:nftMarketplaceAbi,
        functionName:"updateListing",
        args:[nftAddress,tokenId,ethers.utils.parseEther(priceToUpdateListing || "0")],
     })
     console.log(error)
     const {write,data,writeAsync}=useContractWrite(config)
    return (
        <Modal isVisible={isVisible} onOk={()=>writeAsync?.()} onCancel={onClose} onCloseButtonPressed={onClose}>
            <Input 
                label="update listing price in Li Currency (Eth)"
                name="New listing price"
                type="number"
                onChange={event=>{
                    setPriceToUpdateListing(event.target.value)
                }}
            />
            {isError && <span className="italic text-red-400">Error {error}</span>}
        </Modal>
    )
} 
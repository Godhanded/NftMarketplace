import "@/styles/globals.css"
import "@rainbow-me/rainbowkit/styles.css"
import Head from "next/head"

import { getDefaultWallets, RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit"
import { configureChains, createClient, WagmiConfig } from "wagmi"
import { NotificationProvider } from "@web3uikit/core"
import { goerli } from "wagmi/chains"
import { publicProvider } from "wagmi/providers/public"
import Header from "../components/Header"
import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"

const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: "https://api.studio.thegraph.com/query/43179/nftmarket/v0.0.2",
})
const { chains, provider } = configureChains([goerli], [publicProvider()])
const { connectors } = getDefaultWallets({
    appName: "NFT Marketplace",
    chains,
})
const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
})

export default function App({ Component, pageProps }) {
    return (
        <>
            <Head>
                <title>NFT Marketplace</title>
                <meta name="description" content="NFT Marketplace" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <WagmiConfig client={wagmiClient}>
                <RainbowKitProvider chains={chains} theme={darkTheme()}>
                    <ApolloProvider client={client}>
                        <NotificationProvider>
                            <Header />
                            <Component {...pageProps} />
                        </NotificationProvider>
                    </ApolloProvider>
                </RainbowKitProvider>
            </WagmiConfig>
        </>
    )
}

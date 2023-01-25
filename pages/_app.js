import "../styles/globals.css"
import { SessionProvider } from "next-auth/react"
import Layout from "../components/Layout"
import Head from "next/head"
// import { GeistProvider, CssBaseline } from "@geist-ui/core"

function MyApp({ Component, pageProps }) {
   return (
      <SessionProvider session={pageProps.session} refetchInterval={0}>
         <Head>
            <title>VRPay</title>
         </Head>
         {/* <GeistProvider>
            <CssBaseline /> */}
            <Layout>
               <Component {...pageProps} />
            </Layout>
         {/* </GeistProvider> */}
      </SessionProvider>
   )
}

export default MyApp

import CustomNavbar from "./CustomNavbar"
import CustomFooter from "./CustomFooter"
export default function Layout({ children }) {

   return (
      <>
         <CustomNavbar />
         <main>{children}</main>
         <CustomFooter />
      </>
   )
}

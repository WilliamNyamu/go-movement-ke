import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

export default function PublicLayout(){
    return(
        <>
            <Header />
            <main className="min-h-screen">
                <Outlet /> {/* This is where nested routes (pages) will render*/}
            </main>
            <Footer />
        </>
    )
}
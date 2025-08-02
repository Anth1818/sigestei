"use client"
import "../app/globals.css";
import Sidebar from "@/components/layout/Sidebar";


export default function LayoutSideBar({ children }: { children: React.ReactNode }) {
    return (
            <Sidebar>
                {children}
            </Sidebar>     
    )
}
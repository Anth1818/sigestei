import { redirect } from "next/navigation";

export const redirectToLogin = () => redirect("/login")

export const redirectBasedUserType = (userType: string, token: string) => {
    if (!token) {
        redirectToLogin()
    }
    if (userType === "admin") {
        redirect("/admin/dashboard")
    } else if (userType === "user") {
        redirect("/user/request")
    } else if (userType === "technical") {
        redirect("/technical/viewRequest")
    }
}
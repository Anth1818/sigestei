import LayoutSideBar from "@/layouts/LayoutSideBar";
import UserTable from "@/components/users/UserTable";

export default function UserPage () {
    return <LayoutSideBar>
        <p>User page</p>
        <UserTable />
    </LayoutSideBar>
    }

import { useRouter } from "next/navigation";

export const useRedirectBasedType = () => {
    const router = useRouter();
    return (role_id: number) => {
        if (role_id === 1 || role_id === 2) {
            router.push("/dashboard");
        } else if (role_id === 3) {
            router.push("/viewInventory");
        } else if (role_id === 4) {
            router.push("/viewRequest");
        }
    };
};

export const redirectToLogin = () => {
    const router = useRouter();
    router.push("/login");
};
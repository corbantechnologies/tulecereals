"use client";

import { useQuery } from "@tanstack/react-query";

import {
    getAccount,
    getPOSStaffList,
    getPOSStaff,
} from "@/services/accounts";
import useAxiosAuth from "../authentication/useAxiosAuth";
import useUserCode from "../authentication/useUserCode";

export function useFetchAccount() {
    const usercode = useUserCode();
    const header = useAxiosAuth();

    return useQuery({
        queryKey: ["account", usercode],
        queryFn: () => getAccount(usercode!, header),
        enabled: !!usercode,
    });
}

// ─── POS Staff Management Hooks ─────────────────────────────────────────────

export function useFetchPOSStaffList() {
    const header = useAxiosAuth();
    return useQuery({
        queryKey: ["posStaffList"],
        queryFn: () => getPOSStaffList(header),
    });
}

export function useFetchPOSStaff(staffUsercode: string) {
    const header = useAxiosAuth();
    return useQuery({
        queryKey: ["posStaff", staffUsercode],
        queryFn: () => getPOSStaff(staffUsercode, header),
        enabled: !!staffUsercode,
    });
}


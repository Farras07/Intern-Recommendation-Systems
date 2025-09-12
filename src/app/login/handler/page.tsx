"use client"

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react"
import _Fetch from "@/hooks/request.hooks";
import { useSearchParams } from "next/navigation";
import NotFoundError from "@/exceptions/NotFoundError";
import Typography from "@/components/Typography";

export default function Handler () {
    const { data: session } = useSession()
    const router = useRouter();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState<any>({
        isLoading: true,
        message: "Verified your Account..."
    })

    useEffect(() => {
        try {            
            if(session) {
                try {
                    // Check if exists
                    const fetchData = async () => {
                    try {
                        const isEmailExist = await _Fetch(`/user?email=${session?.user.email}`, "GET")
                        console.log(isEmailExist)
                        if (isEmailExist.user.verified) {
                            setLoading({
                                isLoading: true,
                                message: `Login as ${session.user.email}`
                            })
                            setTimeout(() =>{
                                router.push('/dashboard')
                            },3000)
                        };
                        if (!isEmailExist.user.verified) setLoading({
                            isLoading: false,
                            message: "Ask Admin to Verify Your Account"
                        })
    
                    } catch (error: any) {
                        if (error.statusCode === 404) {
                            const role = searchParams.get("role");
                            const payload = {
                                ...session.user,
                                role,
                                verified: false
                            }
                            const a = await _Fetch('/user', "POST", payload)
                            if (a.id) {
                                setLoading({
                                isLoading: false,
                                message: `Ask Admin to Verify Your Account`
                            })
                            }
                        }
                    }
                    };
                    fetchData();          
                } catch {
                
                }
            }
        } catch (err) {
            console.error(err);
        }
    }, []);

    return (
        <div className="flex items-center justify-center h-screen gap-7">
            <div className={`${loading.isLoading? "animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900": "hidden"}`}></div>
            <Typography variant="h6" color="dark">{loading.message}</Typography>
        </div>
    )
}
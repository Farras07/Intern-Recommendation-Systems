"use client";

import Typography from "@/components/Typography"
import Toggle from "@/components/ui/Toggle"
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react"

export default function Login () {
   
    const role = useSelector((state: RootState) => state.role.value);
    
    return (
        <section className="grid grid-cols-2 h-screen w-screen">
            <section 
            className="bg-black col-span-full flex flex-col items-center justify-center gap-2 max-h-[100vh] px-3 md:col-span-1 "
            >
                <Typography variant="h4" weight="bold"
                className="text-white text-center text-[1rem]"
                >
                    Welcome to Fleek Admin - Data Based Decision
                </Typography>
                <Typography variant="p" color="white" weight="regular"
                className="text-center text-[.6rem] md:text-[.7rem]"
                >
                    We're excited to have you here. Sign in to start make data based decision!
                </Typography>
                <div className="mt-4 flex flex-col items-center gap-8 md:hidden">
                    <Toggle/>
                    <div>
                        <a className={role == 'Admin'? 'inline-block': 'hidden'}>
                            <Button
                                variant={"ghost"}
                                className="w-[17rem] border text-center border-slate-800 shadow-xl rounded-3xl text-white"
                                onClick={() => signIn("google", { callbackUrl: "/login/handler" })}
                            >
                                <FcGoogle className="mx-2 text-lg" />
                                Log In With Google
                            </Button>
                        </a>
                        <div className={`w-[17rem] h-[100px] max-w-[1000px] flex flex-col gap-5 ${role === 'Judge'? 'flex':'hidden'} `}>
                            <Input type="email" placeholder="email"/>
                            <Input type="password" placeholder="password"/>
                            <Button className="mt-3 text-typo-dark bg-white">Submit</Button>

                        </div>
                    </div>
                </div>
            </section>
            <section className="hidden flex-col justify-center item-center md:flex  md:">
                <Typography variant="h4" weight="bold"
                className="text-dark text-center text-[1rem]"
                >
                    Log In to Your Account
                </Typography>
                <Typography variant="p" weight="regular"
                className="text-lightgray text-center text-[.7rem]"
                >
                    Enter your verified account
                </Typography>
                <div className="mt-4 flex flex-col items-center gap-8">
                    <Toggle/>
                    <div>
                        <a>
                            <Button
                                variant={"ghost"}
                                className="w-[17rem] border text-center border-slate-800 shadow-xl rounded-3xl text-typo-dark"
                                onClick={() => signIn("google", { callbackUrl: `/login/handler?role=${role}`})}
                            >
                                <FcGoogle className="mx-2 text-lg" />
                                Log In With Google
                            </Button>
                        </a>
                    </div>
                </div>
            </section>
        </section>
    )
} 

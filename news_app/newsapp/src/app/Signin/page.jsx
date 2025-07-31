"use client"
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from 'axios'
import { motion } from "framer-motion"

const page = () => {
  const router = useRouter();
  const [log, setlog] = useState(true)
  const [auth, setauth] = useState({
    email: "",
    password: ""
  })
  const Login = async (e) => {
    e.preventDefault();
    setlog(false);
    if (!auth.email || !auth.password) {
      alert("All fields are required");
      return;
    }
    await axios.post("http://localhost:3000/api/Auth", auth).then((res) => {
      alert(res.data.message);
      setauth({
        email: "",
        password: ""
      })
      setlog(true);
      router.push("/News");
    }).catch((err) => {
      alert(err.response.data.message);
    })
  }
  return (
    <motion.div
      className='flex justify-center items-center min-h-screen bg-[#f5f5eb] bg-gradient-to-br from-[#f5f5eb] to-[#e5e5d7]'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      <Card className="w-full max-w-sm shadow-2xl border border-red-600 bg-white/90">
        <CardHeader>
          <CardTitle className="text-[#1a2238] font-bold">Login to your account</CardTitle>
          <CardDescription className="text-[#444]">
            Enter your email below to login to your account
          </CardDescription>
          <CardAction>
            <a href="/Signup">
              <Button variant="link" className="text-[#1a2238] hover:text-red-600">Sign Up</Button>
            </a>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-[#1a2238]">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  className="bg-[#f5f5eb] border-red-600 focus:border-[#1a2238] text-[#1a2238]"
                  onChange={(e) => setauth({ ...auth, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" className="text-[#1a2238]">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  placeholder="Enter your password"
                  className="bg-[#f5f5eb] border-red-600 focus:border-[#1a2238] text-[#1a2238]"
                  onChange={(e) => setauth({ ...auth, password: e.target.value })}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            type="submit"
            onClick={Login}
            className="w-full bg-red-600 text-white font-bold hover:bg-red-700 transition"
          >
            {log ? "Login" : "Logging in..."}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

export default page
"use client"
import React from "react"
import { useState } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { Globe, Mail, Lock, Github, Chrome, ArrowLeft, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FcGoogle } from "react-icons/fc"
import Link from "next/link"

const Signin = () => {
  const router = useRouter()
  const [isloading, setisloading] = useState(false)

  const [showPassword, setshowPassword] = useState(false)
  const [auth, setauth] = useState(
      {
        
        email: "",
        password: "",
      },
    )
    const handleSubmit = async (e) => {
            setisloading(true)
      e.preventDefault()

      if( !auth.email || !auth.password) {
        alert("Please fill all fields")}
      try {
        await axios.post("http://localhost:3000/api/Auth", auth).then((res)=>{
          sessionStorage.setItem("id",res.data.data._id)
          alert(res.data.message)
          setauth({
            
            email: "",
            password: "",
          })
          router.push("/dashboard")
          setisloading(false)

  
        }).catch((err)=>{
          alert("Error in Logging in")
          setauth({
            
            email: "",
            password: "",
          })
        })
        
      } catch (error) {
        alert("Error logging in, please try again later")
        
      }
    }
  return (
    <div className="min-h-screen
    
     bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Mobile Header */}
      <header className="flex items-center justify-between p-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
       
      </header>

      {/* Content */}
      <div className="flex-1 flex  justify-center ">
        <div className="w-full max-w-lg">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Globe className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to continue your journey</p>
          </div>

          <Card className="border-0 shadow-xl">
            <CardContent className="p-6 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-lg font-medium">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={auth.email}
                      onChange={(e) => setauth({...auth,email:e.target.value})}
                      className="pl-10 h-12 bg-gray-50 border-2"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-lg font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={auth.password}
                      onChange={(e) => setauth({...auth,password:e.target.value})}
                      className="pl-10 pr-10 h-12 bg-gray-50 border-2"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setshowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 text-base font-semibold"
                  disabled={isloading}
                >
                  {isloading ? "Signing In..." : "Sign In"}
                </Button>
              </form>
<div className="text-center mt-6 text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="Signup" className="text-blue-600 hover:underline font-semibold">
              Sign up
            </Link>
          </div>
             
            </CardContent>
          </Card>

          
        </div>
      </div>
    </div>

  )
}

export default Signin
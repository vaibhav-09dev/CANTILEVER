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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axios from 'axios'
import { motion } from "framer-motion"

const Signup = () => {
  const [user, setuser] = useState({
    name: "",
    email: "",
    password: ""
  })
  const [create, setcreate] = useState(true)
  const Sign = async (e) => {
    e.preventDefault();
    if (!user.name || !user.email || !user.password) {
      alert("All fields are required");
      return;
    }
    try {
      setcreate(false);
      await axios.post("http://localhost:3000/api/Adduser", user).then((res) => {
        alert(res.data.message);
        setuser({
          name: "",
          email: "",
          password: ""
        })
        setcreate(true);
        window.location.href = "/Signin";
      }
      ).catch((err) => {
        alert(err.response.data.message);
      })
    } catch (error) {
      console.error("Error creating user:", error);
      alert("Error creating user");
    }
  }

  return (
    <>
     <motion.div
  className="flex h-full w-full justify-center items-center bg-[#f5f5eb] bg-gradient-to-br from-[#f5f5eb] to-[#e5e5d7] px-4 py-2"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.7 }}
>
  <div className="flex flex-col md:flex-row w-full max-w-9xl h-full justify-center items-center gap-6">
    
    {/* Left: Form Section */}
    <motion.div
      className="flex flex-col justify-center items-start w-full md:w-2/3 h-full"
      initial={{ opacity: 0, x: -60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
    >
      <h1 className="text-4xl sm:text-5xl md:text-7xl mb-2 font-serif mt-5 font-extrabold text-[#1a2238] drop-shadow-lg tracking-tight">
        Know<span className="text-red-600">News</span>
      </h1>
      <p className="mt-4 text-base sm:text-lg md:text-2xl mb-4 font-serif font-semibold text-[#444]">
        Join thousands of users who trust our platform
      </p>
      <p className="mb-2 text-sm sm:text-base md:text-lg text-[#7c7c7c]">
        Stay updated with the latest headlines, in-depth analysis, and breaking news from around the world.
      </p>
      <p className="mb-8 text-sm sm:text-base md:text-lg text-[#7c7c7c]">
        Create your free account to personalize your news feed, bookmark articles, and get notifications on topics you care about.
      </p>

      <Card className="w-full max-w-md mx-auto md:ml-36 bg-white/80 backdrop-blur-md border border-red-600 shadow-2xl p-4 transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-[#1a2238] font-bold">Create a new account</CardTitle>
          <CardDescription className="text-[#444]">
            Enter the details below to create a new account
          </CardDescription>
          <CardAction>
            <a href="/Signin">
              <Button variant="link" className="text-[#1a2238] hover:text-red-600">Sign in</Button>
            </a>
          </CardAction>
        </CardHeader>

        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-[#1a2238]">Name</Label>
                <Input
                  id="name"
                  type="name"
                  placeholder="Enter your name"
                  required
                  className="bg-[#f5f5eb] border-[#ddd] focus:border-red-600 focus:ring-2 focus:ring-red-300 text-[#1a2238] transition-all duration-300"
                  onChange={(e) => setuser({ ...user, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-[#1a2238]">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  className="bg-[#f5f5eb] border-[#ddd] focus:border-red-600 focus:ring-2 focus:ring-red-300 text-[#1a2238] transition-all duration-300"
                  onChange={(e) => setuser({ ...user, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-[#1a2238]">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  placeholder="Enter your password"
                  className="bg-[#f5f5eb] border-[#ddd] focus:border-red-600 focus:ring-2 focus:ring-red-300 text-[#1a2238] transition-all duration-300"
                  onChange={(e) => setuser({ ...user, password: e.target.value })}
                />
              </div>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-2">
          <Button
            type="submit"
            onClick={Sign}
            className="w-full bg-red-600 text-white font-bold hover:bg-red-700 hover:scale-[1.02] transition-all duration-300 shadow-md"
          >
            {create ? "Create Account" : "Creating Account..."}
          </Button>
          <div className="w-full text-center mt-2 text-xs text-[#888]">
            By signing up, you agree to our <a href="#" className="underline hover:text-red-600">Terms of Service</a> and <a href="#" className="underline hover:text-red-600">Privacy Policy</a>.
          </div>
        </CardFooter>
      </Card>
    </motion.div>

    {/* Right: Video Section */}
    <motion.div
      className="h-full w-full md:w-1/3 flex justify-center items-center"
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.3 }}
    >
      <video
        src="/v1.mp4"
        poster="/v1.jpg"
        muted
        playsInline
        preload="auto"
        autoPlay
        loop
        controls={false}
        className="h-[220px] sm:h-[280px] md:h-[700] rounded-xl object-cover w-full shadow-2xl border-2 border-[#1a2238]"
      />
    </motion.div>
  </div>
</motion.div>

    </>
  )
}

export default Signup
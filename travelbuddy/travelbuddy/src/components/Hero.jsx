"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Users, Calendar, MessageCircle, Globe, Shield, ArrowRight, Star, Sparkles } from "lucide-react"

const testimonials = [
  {
    name: "Alex T.",
    text: "I met amazing friends on my trip to Japan thanks to TravelConnect. It made my solo adventure unforgettable!",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Priya S.",
    text: "The activity planning feature is a game changer. I joined a hiking group in Peru and had the best time!",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
]

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4)
    }, 3000)
    return () => clearInterval(interval)
  }, [])
const [menuOpen, setMenuOpen] = useState(false)

  const features = [
    {
      icon: MapPin,
      title: "Find Nearby",
      description: "Discover travelers in your area or destination",
      color: "from-blue-500 to-indigo-600",
      bgColor: "from-blue-50 to-indigo-50",
    },
    {
      icon: Calendar,
      title: "Join Activities",
      description: "From dining to hiking, find your perfect activity",
      color: "from-green-500 to-emerald-600",
      bgColor: "from-green-50 to-emerald-50",
    },
    {
      icon: MessageCircle,
      title: "Stay Connected",
      description: "Chat with your activity groups and plan together",
      color: "from-purple-500 to-pink-600",
      bgColor: "from-purple-50 to-pink-50",
    },
    {
      icon: Shield,
      title: "Safe & Secure",
      description: "Verified profiles and secure connections",
      color: "from-orange-500 to-red-600",
      bgColor: "from-orange-50 to-red-50",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full animate-pulse delay-1000"></div>
      </div>

      <header className="backdrop-blur-sm shadow-lg border-b border-slate-200 sticky top-0 z-50 transition-all duration-300">
  <div className="max-w-7xl mx-auto px-4 py-4">
    <div className="flex justify-between items-center">
      {/* Logo */}
      <div className="flex items-center group cursor-pointer">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
          <Globe className="h-6 w-6 text-white animate-spin-slow" />
        </div>
        <div className="ml-2">
          <h1 className="text-lg md:text-4xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">TravelBuddy</h1>
          <p className="text-xs text-gray-500">Connect & Explore</p>
        </div>
      </div>

      {/* Desktop Nav */}
      <div className="hidden md:flex space-x-2">
        <Link href="/Signin">
          <Button variant="ghost" size="lg" className="text-lg hover:scale-105 transition-transform duration-200">
            Sign In
          </Button>
        </Link>
        <Link href="/Signup">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-lg hover:scale-105 hover:shadow-lg transition-all duration-200"
          >
            Join
          </Button>
        </Link>
      </div>

      {/* Mobile Toggle Button */}
      <div className="md:hidden">
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-700 focus:outline-none">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>
    </div>

    {/* Mobile Nav Dropdown */}
    {menuOpen && (
      <div className="md:hidden mt-3 space-y-2 transition-all duration-300">
        <Link href="/Signin">
          <Button variant="ghost" className="w-full text-left">
            Sign In
          </Button>
        </Link>
        <Link href="/Signup">
          <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600">Join</Button>
        </Link>
      </div>
    )}
  </div>
</header>


      {/* Hero Section - Mobile Optimized */}
      <section className="px-4 py-12 text-center relative">
        <div className="max-w-md mx-auto">
          <div
           className={`transition-all duration-1000 delay-300 ${
              isVisible ? "translate-y-0 opacity-100 scale-100" : "translate-y-8 opacity-0 scale-95"
            }`}
          >
            <div className="w-40 h-40 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-gentle hover:animate-pulse cursor-pointer transform hover:scale-110 transition-transform duration-300 shadow-2xl relative">
              <Users className="h-20 w-20 text-white" />
              <Sparkles className="absolute -top-2 -left h-6 w-6 text-yellow-400 animate-ping" />
            </div>
          </div>

          <div
            className={`transition-all duration-1000 delay-500 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4 leading-tight">
              Meet Fellow{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
                Travelers
              </span>
            </h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Discover travelers nearby, join activities, and create amazing memories together.
            </p>
          </div>

          <div
            className={`space-y-3 transition-all duration-1000 delay-700 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <Link href="/Signup" className="block">
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 h-12 text-base font-semibold hover:scale-105 hover:shadow-xl transition-all duration-300 group"
              >
                Start Connecting
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </Link>
            <Link href="/Signin" className="block">
              <Button
                variant="outline"
                size="lg"
                className="w-full h-12 text-base bg-transparent hover:scale-105 hover:bg-white hover:shadow-lg transition-all duration-300"
              >
                Explore Activities
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Animated Stats Section */}
      <section className="px-4 py-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-md mx-auto">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { value: "10K+", label: "Travelers", delay: "delay-100" },
              { value: "500+", label: "Cities", delay: "delay-300" },
              { value: "50K+", label: "Activities", delay: "delay-500" },
            ].map((stat, index) => (
              <div
                key={index}
                className={`p-4 transform hover:scale-110 transition-all duration-300 cursor-pointer ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                } ${stat.delay}`}
              >
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Features Section */}
      <section className="px-4 py-12">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <h3
      className={`text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-10 transition-all duration-1000 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      Everything You Need
    </h3>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
      {features.map((feature, index) => {
        const Icon = feature.icon
        const isActive = activeFeature === index

        return (
          <Card
            key={index}
            className={`border-0 shadow-lg bg-gradient-to-r ${feature.bgColor} transform transition-all duration-500 cursor-pointer hover:scale-[1.03] ${
              isActive ? "scale-[1.03] shadow-xl" : ""
            } ${isVisible ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"}`}
            style={{ transitionDelay: `${index * 200}ms` }}
            onMouseEnter={() => setActiveFeature(index)}
          >
            <CardContent className="p-6 sm:p-7 md:p-8">
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center flex-shrink-0 transform transition-all duration-300 ${
                    isActive ? "rotate-12 scale-110" : ""
                  }`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>

                <div className="flex-1">
                  <h4 className=" text-gray-800 text-base sm:text-xl font-bold mb-2 transition-colors duration-300">
                    {feature.title}
                  </h4>
                  <p className="text-lg text-gray-600">{feature.description}</p>
                </div>

                <div
                  className={`w-2 h-2 rounded-full bg-gradient-to-r ${feature.color} transition-all duration-300 ${
                    isActive ? "scale-150" : "scale-100"
                  }`}
                ></div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  </div>
</section>


      {/* Animated Testimonials */}
<section className="px-4 py-12 bg-white/50 backdrop-blur-sm">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
    <h3
      className={`text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-10 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      } transition-all duration-1000`}
    >
      What Travelers Say
    </h3>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 gap-y-12">
      {[
        {
          text: "Found amazing travel buddies in Tokyo! The app made it so easy to connect.",
          author: "Sarah Chen",
          role: "Digital Nomad",
          initials: "SC",
          gradient: "from-blue-400 to-purple-400",
        },
        {
          text: "Perfect for finding hiking partners and exploring new cities together!",
          author: "Mike Rodriguez",
          role: "Adventure Seeker",
          initials: "MR",
          gradient: "from-green-400 to-blue-400",
        },
      ].map((testimonial, index) => (
        <Card
          key={index}
          className={`border-0 shadow-lg bg-white transform transition-all duration-700 hover:scale-105 hover:shadow-xl cursor-pointer ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
          style={{ transitionDelay: `${index * 300}ms` }}
        >
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 text-yellow-400 fill-current transition-all duration-200 hover:scale-125"
                  style={{ animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>

            <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>

            <div className="flex items-center">
              <div
                className={`w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-r ${testimonial.gradient} rounded-full flex items-center justify-center transform hover:scale-110 transition-transform duration-300`}
              >
                <span className="text-white font-semibold text-sm">{testimonial.initials}</span>
              </div>
              <div className="ml-3">
                <p className="font-semibold text-sm">{testimonial.author}</p>
                <p className="text-xs text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
</section>

      
      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-md mx-auto px-4">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center hover:scale-110 transition-transform duration-300">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-semibold">TravelBuddy</span>
            </div>
            <p className="text-gray-400">Connecting travelers worldwide</p>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4 text-sm">Platform</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                {["Explore", "Activities", "Destinations"].map((item, index) => (
                  <li key={index}>
                    <Link
                      href={`/${item.toLowerCase()}`}
                      className="hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm">Support</h4>
              <ul className="space-y-3 text-sm text-gray-400">
                {["Help Center", "Safety", "Contact"].map((item, index) => (
                  <li key={index}>
                    <Link
                      href={`/${item.toLowerCase().replace(" ", "")}`}
                      className="hover:text-white transition-colors duration-200 hover:translate-x-1 inline-block"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 TravelBuddy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )

}

export default Hero
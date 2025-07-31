"use client"
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { motion } from "framer-motion";
import { useRouter } from 'next/navigation';

// Add: dark theme toggle
const page = () => {
    const router = useRouter();
    const [all, setall] = useState([]);
    const [search, setsearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [dark, setDark] = useState(
        typeof window !== "undefined"
            ? localStorage.getItem("theme") === "dark"
            : false
    );

    // Apply dark class to <body>
    useEffect(() => {
        if (dark) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [dark]);

    // Load search state from localStorage on mount
    useEffect(() => {
        const savedSearch = localStorage.getItem("search");
        const savedResults = localStorage.getItem("searchResults");
        if (savedSearch) setsearch(savedSearch);
        if (savedResults) setSearchResults(JSON.parse(savedResults));
    }, []);

    // Save search state to localStorage when it changes
    useEffect(() => {
        localStorage.setItem("search", search);
        localStorage.setItem("searchResults", JSON.stringify(searchResults));
    }, [search, searchResults]);
    
    // Fetch all news on mount
    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await axios.get(
                    `https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEXT_PUBLIC_API_KEY}`
                );
                setall(response.data.articles);
            } catch (error) {
                console.error("Error fetching news:", error);
                alert("Error fetching news1");
            }
        };
        fetchNews();
    }, []);

    // Fetch news based on search when search changes (and is not empty)
    useEffect(() => {
        if (!search) return;
        const fetchSearch = async () => {
            try {
                const response = await axios.get(
                    `https://newsapi.org/v2/everything?q=${search}&sortBy=publishedAt&apiKey=${process.env.NEXT_PUBLIC_API_KEY}`
                );
                setSearchResults(response.data.articles);
            } catch (error) {
                if (error.response) {
                    console.error("Error fetching news:", error.response.data);
                    alert("Error fetching news2: " + (error.response.data.message || "Unknown error"));
                } else if (error.request) {
                    console.error("No response received:", error.request);
                    alert("No response from NewsAPI");
                } else {
                    console.error("Error:", error.message);
                    alert("Error: " + error.message);
                }
            }
        };
        fetchSearch();
    }, [search]);

    // Remove getNews from button handlers except for manual search
    const getNews = () => {
        if (search) setsearch(search); // triggers useEffect above
    }; 
    
const handleLogout=()=>{
    localStorage.removeItem("User");
    localStorage.removeItem("token");
        
        router.push("/Signin");}
    
    return (
        <motion.div
        className='max-w-8xl mx-auto px-2 mt-4 min-h-screen bg-amber-50 dark:bg-[#18181b] transition-colors duration-300'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            {/* Dark theme toggle */}
            <div className="flex justify-end p-4">
                <Button className={"mr-3 bg-red-500"} onClick={handleLogout}>Logout</Button>
                <Button
                    variant="outline"
                    className="rounded-full"
                    onClick={() => setDark((d) => !d)}
                >
                    {dark ? "🌙 Dark" : "☀️ Light"}
                </Button>
            </div>
            {/* Search Section */}
            <motion.div
                className='flex justify-center items-center mt-10'
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
            >
                <Input
                    type="text"
                    className={"w-full font-bold max-w-md mb-4 mt-5 ml-3 mr-1.5"}
                    value={search}
                    onChange={(e) => setsearch(e.target.value)}
                    placeholder="Search news..."
                />
                <span>
                    <Button onClick={getNews}>Search</Button>
                </span>
            </motion.div>
           <motion.div
    className="flex flex-wrap justify-center gap-4 mt-10 px-4"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 0.2 }}
>
    <Button className="rounded-3xl text-base sm:text-lg" onClick={() => { setsearch(""); setSearchResults([]); }}>Home</Button>
    <Button className="rounded-3xl text-base sm:text-lg" onClick={() => setsearch("sports")}>Sports</Button>
    <Button className="rounded-3xl text-base sm:text-lg" onClick={() => setsearch("entertainment")}>Entertainment</Button>
    <Button className="rounded-3xl text-base sm:text-lg" onClick={() => setsearch("international")}>International</Button>
    <Button className="rounded-3xl text-base sm:text-lg" onClick={() => setsearch("stocks")}>Stocks</Button>
</motion.div>
 <motion.div
                className="max-w-8xl mx-auto px-2 mt-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
            >
                {searchResults.length > 0 && (
                    <>
                        <h2 className="text-xl font-bold mb-2">Search Results</h2>
                        <HoverEffect items={searchResults} />
                    </>
                )}
            </motion.div>
            {/* All News Section */}
            <motion.div
                className="max-w-8xl mx-auto px-2 mt-8"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
            >
                <h2 className="text-5xl font-bold mb-2 ml-4">Latest  News</h2>
                <HoverEffect items={all} />
            </motion.div>
        </motion.div>
    );
};

export default page
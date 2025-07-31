"use client"

import React, { useState, useEffect, useRef } from "react"
import { LoaderOne } from "@/components/ui/loader";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import axios from "axios"
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar,
  Users,
  MessageCircle,
  Search,
  Plus,
  Filter,
  Home,
  Compass,
  Bell,
  User,
  Heart,
  Navigation,
  Zap,
  TrendingUp,
  MapPin, } from "lucide-react"
import Link from "next/link"
import { set } from "mongoose"

// Main Dashboard Page
const page = () => {
  const [active, setactive] = useState([])
  const [user, setuser] = useState([])
  const [id, setid] = useState("")
  const [curr, setcurr] = useState([])
  const [all, setall] = useState([])
  
  const [unread, setunread] = useState(false)


  const [selectedUser, setSelectedUser] = useState(null);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [chatTabs, setChatTabs] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);


  const [loading, setloading] = useState(false);

  const bottomRef = useRef(null);
const router = useRouter();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Get user id from sessionStorage
  useEffect(() => {
    const storedid = sessionStorage.getItem("id");
    if (storedid) {
      setid(storedid)
    }
  }, [])




  const fetchMessages = async (toId) => {
    try {
      setunread(false);
      const res = await axios.get(`http://localhost:3000/api/Get_Messages?from=${id}&to=${toId}`);
      setloading(true);
      setunread(true);
      setMessages(res.data.messages || []);
      setSelectedUser(toId);
       setChatTabs((prev) =>
      prev.map((u) => (u._id === toId ? { ...u, unreadCount: 0 } : u))
    );
    } catch (err) {
      console.error("Error fetching messages", err);
    }
  };
  

  

  const sendMessage = async () => {
    const message = inputRef.current.value.trim();
    if (!message || !selectedUser) return;

    try {
      const res = await axios.post("http://localhost:3000/api/Send_Messages", {
        from: id,
        to: selectedUser,
        message,
      });

      if (res.data.success) {
        inputRef.current.value = "";
        fetchMessages(selectedUser);
      }

      setMessages((prev) => [
        ...prev,
        { from: id, to: selectedUser._id, message },
      ]);
      setMessage("");

    } catch (err) {
      console.error("Error sending message", err);
    }
  };





  // Fetch users and activities
  const fetchuser = async () => {
    try {
      await axios.get(`http://localhost:3000/api/All_user?id=${id}`).then((res) => {
        setuser(res.data.data)
        setChatTabs(
          res.data.data.map((u) => ({
            ...u,
            unreadCount: 0,
          }))
        );

      }).catch(() => {
        console.error("Error fetching user data")
      })
    } catch (error) {
      alert(error.message)
    }
  }
  const fetchActivities = async () => {
    try {
      await axios.get(`http://localhost:3000/api/Your_activity?id=${id}`)
        .then((res) => {
          
          setactive(res.data.data)
          if (res.data.data.length === 0) {
            alert("No activities found for this user")
          }
        })
        .catch((err) => {
          console.error(err.message)
        })


    } catch (error) {
      alert(error.message)
      console.log(error.message)
    }
  }
  const fetchAllActivities = async () => {
    try {
      await axios.get(`http://localhost:3000/api/All_activity?id=${id}`).then((res) => {

        setall(res.data.data)
        if (res.data.data.length === 0) {
          alert("No activities found ")
        }
      }
      ).catch(() => {
        console.error("Error fetching activities")
      })

    } catch (error) {
      alert(error.message)
    }
  }
  const fetchcurrent = async () => {
    try {
      await axios.get(`http://localhost:3000/api/Current_user?id=${id}`).then((res) => {
        setcurr(res.data.data)
        if (res.data.data.length === 0) {
          alert(res.data.message)
        }
      }
      ).catch(() => {
        console.error("Error fetching ")
      })

    } catch (error) {
      alert(error.message)
    }
  }
  useEffect(() => {
    if (id) {
      fetchActivities();
      fetchuser();
      fetchcurrent();
      fetchAllActivities();
    }
    // eslint-disable-next-line
  }, [id])
  const fetchUnreadCounts = async () => {
    if (!id) return;
    try {
      const res = await axios.get(`http://localhost:3000/api/Unread?userIdfrom=${id}`);
      const unreadData = res.data || [];
       const counts = {};
    res.data.forEach((item) => {
      counts[item.userId] = item.count;
    });
  setunread(counts);
      setChatTabs((prevTabs) =>
        prevTabs.map((tab) => {
          const unreadObj = unreadData.find((u) => u.userId === tab._id);
          return {
            ...tab,
            unread: counts[tab._id] || 0, // Use the count from unreadData or default to 0
          };
        })
      );
    } catch (err) {
      console.error("Error fetching unread counts:", err);
    }
  };
   


const handleOpenChat = async (traveler) => {
  try {
    await axios.put(`http://localhost:3000/api/Unread?to=${traveler._id}&from=${id}`);
    setSelectedUser(traveler._id);
    setIsChatOpen(true);
    fetchMessages(traveler._id);
    fetchUnreadCounts();
    setunread(
      (prev) => {
        const copy = { ...prev };
        copy[traveler._id] = 0; // Reset unread count for this user
        return copy;
      }

    );

    // Reset unread UI
    setChatTabs((prev) =>
      prev.map((u) =>
        u._id === traveler._id ? { ...u, unreadCount: 0 } : u
      )
    );
  } catch (err) {
    console.error("Error marking messages as read", err);
  }
};


useEffect(() => {
    if (!selectedUser) return;
    const interval = setInterval(() => {
      fetchMessages(selectedUser);
      
    }, 5000);
    return () => clearInterval(interval);
  }, [selectedUser]);

  // Fetch initial data
  useEffect(() => {
    if (id) {
      fetchuser();
      fetchUnreadCounts();
    }
  }, [id]);
  useEffect(()=>{
    fetchUnreadCounts();
  })
  useEffect(() => {
  const interval = setInterval(() => {
    fetchUnreadCounts(); // polling every 5s
  }, 8000);

  return () => clearInterval(interval);
}, []);

const handleLogout=()=>{
   try {
     sessionStorage.removeItem('id');
     alert("logged out successfully")
   router.push("/Signin")
   } catch (error) {
    alert(error.message)
    
   }
    
  }




  const mapRef = useRef(null);
  const inputRef = useRef(null);
  const [map, setMap] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [distanceInfo, setDistanceInfo] = useState(null);
  const [distances, setDistances] = useState({});

  const goMapsUrl = `https://maps.gomaps.pro/maps/api/js?key=${ process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places,geometry,drawing&callback=initMap`;
  useEffect(() => {
    const loadScript = (url) => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${url}"]`)) {
          resolve();
          return;
        }
        const script = document.createElement("script");
        script.src = url;
        script.async = true;
        script.defer = true;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    if (user.length > 0 && curr) {
      loadScript(goMapsUrl)
        .then(() => initMap())
        .catch((err) => console.error("Map load failed:", err));
    }
  }, [user, curr]);

  const initMap = () => {
    const defaultCenter = { lat: 28.6139, lng: 77.2090 }; // Delhi
    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: 10,
    });

    setMap(mapInstance);

    const geocoder = new window.google.maps.Geocoder();
    const directionsService = new window.google.maps.DirectionsService();
    let directionsRenderer = null;

    let currLatLng = null;

    // 1. Geocode current user and place marker
    if (curr?.location) {
      geocoder.geocode({ address: curr.location }, (results, status) => {
        if (status === "OK" && results[0]) {
          currLatLng = results[0].geometry.location;

          // Marker for current user
          new window.google.maps.Marker({
            map: mapInstance,
            position: currLatLng,
            title: "You",

          });

          mapInstance.setCenter(currLatLng);


          
          // 2. After current user is placed, load other users
          user.forEach((traveler) => {
            if (traveler?.location) {
              geocoder.geocode({ address: traveler.location }, (results, status) => {
                if (status === "OK" && results[0]) {
                  const travelerLatLng = results[0].geometry.location;

                  // Marker for traveler
                  const marker = new window.google.maps.Marker({
                    map: mapInstance,
                    position: travelerLatLng,
                    title: traveler.name,
                    icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                  });
                 

                  // Calculate distance (in km)
                  const distance = (
                    window.google.maps.geometry.spherical.computeDistanceBetween(
                      currLatLng,
                      travelerLatLng
                    ) / 1000
                  ).toFixed(2);

                  // Save distance to state
                  setDistances(prev => ({
                    ...prev,
                    [traveler._id]: distance
                  }));

                  // InfoWindow for name + distance
                  const infoWindow = new window.google.maps.InfoWindow({
                    content: `<div><strong>${traveler.name}</strong><br>${distance} km away</div>`,
                  });

                  marker.addListener("click", () => {
                    infoWindow.open(mapInstance, marker);

                    // Clear previous directions
                    if (directionsRenderer) {
                      directionsRenderer.setMap(null);
                    }

                    // Render new route
                    directionsService.route(
                      {
                        origin: currLatLng,
                        destination: travelerLatLng,
                        travelMode: window.google.maps.TravelMode.DRIVING,
                      },
                      (result, status) => {
                        if (status === "OK") {
                          directionsRenderer = new window.google.maps.DirectionsRenderer({
                            map: mapInstance,
                            directions: result,
                            suppressMarkers: true,
                            preserveViewport: true,
                            polylineOptions: {
                              strokeColor: "#4A90E2",
                              strokeOpacity: 0.6,
                              strokeWeight: 4,
                            },
                          });
                        } else {
                          console.error("Directions request failed:", status);
                        }
                      }
                    );
                  });
                } else {
                  console.error("Geocode failed for traveler:", status);
                }
              });
            }
          });
        } else {
          console.error("Geocode failed for current user:", status);
        }
      });
    }
  };
  const [menuOpen, setMenuOpen] = useState(false)

  // Render the dashboard
  if (!user || !curr || !active || !all) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }
  if (user.length === 0) {
    return <LoaderOne  />
  }




  return (
    <div className="min-h-screen bg-slate-50">
     {/* Header */}
 <header className="w-full  z-50 ">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        
        {/* Logo or Greeting */}
        <div className="flex items-center justify-center space-x-3">
          <Zap className="text-yellow-500 h-8 w-8 animate-pulse" />
          <div className="text-gray-800">
            <p className="text-lg md:text-2xl text-gray-600">Welcome back,</p>
            <h1 className="text-xl md:text-3xl font-bold">
              {curr?.name?.split(" ")[0] || "Traveler"} 👋
            </h1>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/Create">
            <Button variant="ghost" className="text-lg">
              <Plus className="w-4 h-4 mr-1" /> New Activity
            </Button>
          </Link>

          <Button
            onClick={handleLogout}
            size='lg'
            className="bg-red-500  hover:bg-red-400 text-white"
          >
            <User className="w-4 h-4 mr-1" /> Logout
          </Button>

          <Link href="/Profile">
            <Avatar className="h-11 w-11 border-2 border-gray-400">
              <AvatarImage src={curr?.pic || "/placeholder.svg"} />
              <AvatarFallback>
                {curr?.name
                  ? curr.name
                      .split(" ")
                      .slice(0, 2)
                      .map((w) => w[0])
                      .join("")
                      .toUpperCase()
                  : "?"}
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
  {menuOpen ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
    </svg>
  )}
</button>

        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden  backdrop-blur-md px-6 py-4 space-y-3">
          <Link href="/Create" onClick={() => setMenuOpen(false)}>
            <Button variant="outline" className="w-full justify-start mb-2">
              <Plus className="w-4 h-4 mr-2" /> Create Activity
            </Button>
          </Link>

          <Button
            onClick={() => {
              handleLogout()
              setMenuOpen(false)
            }}
            className="bg-red-500 hover:bg-red-400 text-white w-full justify-start"
          >
            <User className="w-4 h-4 mr-2" /> Logout
          </Button>

          <Link href="/Profile" onClick={() => setMenuOpen(false)}>
            <div className="flex items-center space-x-3 mt-2">
              <Avatar className="h-10 w-10 border-2 border-gray-400">
                <AvatarImage src={curr?.pic || "/placeholder.svg"} />
                <AvatarFallback>
                  {curr?.name
                    ? curr.name
                        .split(" ")
                        .slice(0, 2)
                        .map((w) => w[0])
                        .join("")
                        .toUpperCase()
                    : "?"}
                </AvatarFallback>
              </Avatar>
              <p className="font-medium text-gray-700">{curr?.name}</p>
            </div>
          </Link>
        </div>
      )}
    </header>  
        <div className="w-full mx-auto px-1 sm:px-1 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Map Section */}
            <Card className="shadow-lg border-slate-200">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Travelers Near You
                </CardTitle>
                <CardDescription>Discover fellow travelers in your area and upcoming destinations</CardDescription>
              </CardHeader>
              <CardContent>
                <div ref={mapRef} className="h-96 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                </div>
              </CardContent>
            </Card>

            {/* Nearby Travelers */}
           <Card className="shadow-lg border-slate-200">
  <CardHeader>
    <CardTitle className="flex items-center text-lg sm:text-xl">
      <Users className="h-5 w-5 mr-2" />
      Nearby Travelers
    </CardTitle>
  </CardHeader>

  <CardContent className="space-y-4">
    {chatTabs.map((traveler) => (
      <div
        key={traveler._id}
        className="relative flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
      >
        {/* Avatar */}
        <div className="flex-shrink-0">
          <Avatar className="h-12 w-12">
            <AvatarImage src={traveler.pic || "/placeholder.svg"} />
            <AvatarFallback>
              {traveler.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-1 space-y-1 sm:space-y-0">
            <p className="font-bold text-lg truncate">{traveler.name}</p>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-blue-100 text-blue-900 text-xs">
                {traveler.occupation || "Traveler"}
              </Badge>
              <Badge className="bg-pink-100 text-pink-800 text-xs">
                {traveler.age || "--"} years
              </Badge>
            </div>
          </div>

          {/* Location */}
          <p className="text-sm text-blue-700 flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            {traveler.location || "Unknown"}
          </p>

          {/* About + Message */}
          <div className="mt-2 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
            <p className="text-sm text-gray-700 font-medium">
              {traveler.about || "No bio available."}
            </p>
            <div className="relative inline-block">
          
          <Button onClick={() => handleOpenChat(traveler)}>
            Message
          </Button>
             {traveler.unread > 0 && (
       <span className="
      absolute 
      top-0 
      left-16
      translate-x-1/2 
      -translate-y-1/2
      bg-red-500 
      text-white 
      text-xs 
      rounded-full 
      px-2 
      py-0.5 
      pointer-events-none
      select-none
      ">
        {traveler.unread}
      </span>
    )}

          {/* Red Dot if unread */}
          
        </div>
      </div>
    </div>
  </div>
))}

              </CardContent>
            </Card>

          </div>

          {/* Sidebar */}
          <div className="space-y-6 w-full">
            {/* Activities Section */}
            <Card className="shadow-lg border-slate-200">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      Your Activities
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {active.map((activity) => (
                    <div
                      key={activity._id}
                      className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{activity.title}</h3>
                        <Badge className="text-sm bg-blue-100 text-blue-800 font-semibold">{activity.type}</Badge>
                      </div>

                      <div className="flex flex-col text-xs text-gray-800 space-x-4 mb-3">
                        <span className="text-xs text-gray-800 font-medium flex items-center mb-1">


                          <Calendar className="h-4 w-4 mr-1" />
                          {activity.date} at {activity.time}

                        </span>
                        <span className="flex text-sm font-semibold text-gray-800 items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {activity.location}
                        </span>

                      </div>

                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center"></div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-slate-200">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      All Activities
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {all.map((allactivity) => (
                    <div
                      key={allactivity._id}
                      className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">{allactivity.title}</h3>
                        <Badge className="text-sm bg-blue-100 text-blue-800 font-semibold">{allactivity.type}</Badge>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-2">{allactivity.descp}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-2">
                          organized by{" "}
                          <span className="font-semibold text-blue-600">
                            {allactivity.user[0]?.name || "Unknown User"}
                          </span>
                        </p>
                      </div>
                      <div className="flex flex-col text-xs text-gray-800 space-x-4 mb-3">
                        <span className="text-xs text-gray-800 font-medium flex items-center mb-1">


                          <Calendar className="h-4 w-4 mr-1" />
                          {allactivity.date} at {allactivity.time}

                        </span>
                        <span className="flex text-sm font-semibold text-gray-800 items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {allactivity.location}
                        </span>

                      </div>

                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center"></div>
              </CardContent>
            </Card>




            {isChatOpen && (
  <div className="fixed bottom-2 top-2 h-full right-4 md:right-2  w-[90vw] max-w-[500px] bg-white shadow-xl rounded-xl border z-50 sm:right-8 sm:bottom-4 sm:top-auto sm:h-[90vh]">
    <Card className="w-full h-full flex flex-col">
      {/* Header */}
      <CardHeader className="flex justify-between items-center border-b py-3 px-4">
        <CardTitle className="text-base flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={
                user.find((u) => u._id === selectedUser)?.pic || "/placeholder.svg"
              }
              alt={user.find((u) => u._id === selectedUser)?.name || "User"}
            />
            <AvatarFallback>
              {user
                .find((u) => u._id === selectedUser)
                ?.name?.split(" ")
                .map((n) => n[0])
                .join("") || "U"}
            </AvatarFallback>
          </Avatar>
          <span>
            {user.find((u) => u._id === selectedUser)?.name || "User"}
          </span>
        </CardTitle>

        <Button
          variant="ghost"
          size="icon"
          className="text-xl"
          onClick={() => setIsChatOpen(false)}
        >
          ❌
        </Button>
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 overflow-y-auto px-4 py-2 space-y-2 bg-gray-50">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.from === id ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] px-4 py-2 text-sm rounded-xl ${
                msg.from === id
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-200 text-black rounded-bl-none"
              }`}
            >
              {msg.message}
            </div>
          </div>
        ))}
      </CardContent>

      {/* Input */}
      <div className="p-3 border-t flex items-center gap-2">
        <Input
          placeholder="Type your message..."
          ref={inputRef}
          className="flex-1"
        />
        <Button onClick={sendMessage} disabled={!selectedUser}>
          Send
        </Button>
      </div>
    </Card>
  </div>
)}


          </div>

        </div>
      </div>
    </div>
  )
}
  
export default page
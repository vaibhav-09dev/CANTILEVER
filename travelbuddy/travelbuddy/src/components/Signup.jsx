"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { Checkbox } from "@/components/ui/checkbox"
import { Camera, MapPin, Globe, User, X } from "lucide-react"
import axios from "axios"
import { set } from "mongoose"


const interests = [
  "Photography",
  "Hiking",
  "Food & Dining",
  "Museums",
  "Art",
  "Music",
  "Nightlife",
  "Sports",
  "Shopping",
  "Coffee",
  "Co-working",
  "Tours",
  "Adventure",
  "Culture",
  "Nature",
  "History",
  "Architecture",
  "Local Life",
]

const languages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Chinese",
  "Japanese",
  "Korean",
  "Arabic",
  "Russian",
  "Dutch",
]



const page = () => {
  const mapRef = useRef(null);
  const inputRef = useRef(null);
  const [map, setMap] = useState(null);


  const [marker, setMarker] = useState(null);

  const goMapsUrl = `https://maps.gomaps.pro/maps/api/js?key=${ process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
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

    loadScript(goMapsUrl)
      .then(() => initMap())
      .catch((err) => console.error("Map load failed:", err));
  }, []);

  // Initialize the map and autocomplete
  const initMap = () => {
    // Helper to actually create the map
    const createMap = (center, showMarker = false) => {
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center,
        zoom: 5,
      });
      setMap(mapInstance);

      // Only add marker if showMarker is true
      if (showMarker) {
        new window.google.maps.Marker({
          position: center,
          map: mapInstance,
          title: formData.location,
        });
      }

      // Autocomplete input
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current);
      autocomplete.bindTo("bounds", mapInstance);

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) {
          alert("No details available for input.");
          return;
        }
        setFormData((prev) => ({
          ...prev,
          location:  place.name || "",
        }));

        const destination = place.geometry.location;

        if (directionsRenderer) {
          directionsRenderer.setMap(null);
        }

        const directionsService = new window.google.maps.DirectionsService();
        const newDirectionsRenderer = new window.google.maps.DirectionsRenderer();
        newDirectionsRenderer.setMap(mapInstance);
        setDirectionsRenderer(newDirectionsRenderer);

        directionsService.route(
          {
            origin: center,
            destination: destination,
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === "OK") {
              newDirectionsRenderer.setDirections(result);

              const route = result.routes[0].legs[0];
              setDistanceInfo({
                distance: route.distance.text,
                duration: route.duration.text,
                end_address: route.end_address,
              });
            } else {
              alert("Directions request failed due to " + status);
            }
          }
        );
      });
    };

    // If user has a location, geocode it and center map there
    if (formData.location) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: formData.location }, (results, status) => {
        if (status === "OK" && results[0]) {
          const loc = results[0].geometry.location;
          createMap({ lat: loc.lat(), lng: loc.lng() });
        } else {
          // Fallback to default center if geocoding fails
          createMap({ lat: 28.6139, lng: 77.2090 });
        }
      });
    } else {
      // No location set, use default center
      createMap({ lat: 28.6139, lng: 77.2090 });
    }
  };
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    about: "",
    location: "",
    age: "",
    occupation: "",
    interests: [],
    languages: [],
    travelStyle: "",
    isPublic: true,
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await axios.post(`http://localhost:3000/api/Add_User`, formData).then((res) => {
        alert(res.data.message)
        setFormData({
          name: "",
          email: "",
          password: "",
          about: "",
          location: "",
          age: "",
          occupation: "",
        })
        router.push("/Signin")
        setIsLoading(false)
      }).catch((error) => {
        alert(error.response?.data?.message || "Something went wrong")
        setIsLoading(false)


      })
    } catch (error) {
      alert("Something went wrong")

    }
  }


  // Add this function inside your component
  const geocodeLocation = (address, callback) => {
    if (!window.google || !window.google.maps) return;
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === "OK" && results[0]) {
        const location = results[0].geometry.location;
        callback(location);
      }
    });
  };

  useEffect(() => {
    if (!map || !formData.location) return;
    geocodeLocation(formData.location, (location) => {
      map.setCenter(location);
      map.setZoom(14); // <-- Zoom in when location is set
      // Remove previous marker if it exists
      if (marker) {
        marker.setMap(null);
      }
      // Add new marker
      const newMarker = new window.google.maps.Marker({
        position: location,
        map: map,
        title: formData.location,
      });
      setMarker(newMarker);
    });
    // eslint-disable-next-line
  }, [formData.location, map]);

  return (
   <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-100 to-indigo-100 py-6">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-10">
    
    {/* Left: Map Section */}
    <div className="w-full md:w-1/2 flex items-start">
      <div
        ref={mapRef}
        className="w-full h-[300px] md:h-[calc(100vh-100px)] rounded-2xl border border-blue-200 bg-slate-200 shadow-xl"
      />
    </div>

    {/* Right: Form Section */}
    <div className="w-full md:w-1/2">
      <Card className="shadow-2xl border-0 rounded-3xl bg-white/95">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-blue-700">Create a New Account</CardTitle>
          <CardDescription className="text-base text-gray-500">
            Help other travelers get to know you and find the perfect activity partners.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <Label htmlFor="name" className="text-lg font-semibold">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-2 rounded-lg"
              />
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-lg font-semibold">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-2 rounded-lg"
              />
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password" className="text-lg font-semibold">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="mt-2 rounded-lg"
              />
            </div>

            {/* About Me */}
            <div>
              <Label htmlFor="bio" className="text-lg font-semibold">About Me</Label>
              <Textarea
                id="bio"
                placeholder="Tell other travelers about yourself..."
                value={formData.about}
                onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                rows={4}
                className="mt-2 rounded-lg"
              />
            </div>

            {/* Location + Age */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="location" className="text-lg font-semibold">Location</Label>
                <div className="relative mt-2">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="location"
                    ref={inputRef}
                    placeholder="e.g., Mumbai"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="pl-10 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="age" className="text-lg font-semibold">Age</Label>
                <Input
                  id="age"
                  type="number"
                  min="18"
                  max="100"
                  placeholder="25"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="mt-2 rounded-lg"
                />
              </div>
            </div>

            {/* Occupation */}
            <div>
              <Label htmlFor="occupation" className="text-lg font-semibold">Occupation</Label>
              <Input
                id="occupation"
                placeholder="e.g., Developer, Student"
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                className="mt-2 rounded-lg"
              />
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full py-3 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:scale-[1.02] transition-transform"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
</div>

  )
}

export default page
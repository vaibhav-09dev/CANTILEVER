"use client"

import { useState,useRef,useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import axios from "axios"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, MapPin, Users, Clock } from "lucide-react"
import { format } from "date-fns"
import { GoogleMap,useJsApiLoader,Marker,Autocomplete } from "@react-google-maps/api"

const activityTypes = [
  "Dining","Running", "Hiking", "Co-working", "Photography", "Museums", "Nightlife",
  "Sports", "Shopping", "Tours", "Concerts", "Art", "Coffee", "Other",
]

const page = () => {
  
    const [curr, setcurr] = useState([])
    
  
   const [id, setid] = useState("")
   useEffect(()=>{
    const storedid= sessionStorage.getItem("id");
    if(storedid){
      setid(storedid)
    }
   },[])
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

         fetchcurrent();
       }
       
     }, [id])
   
  const [act, setact] = useState({
    title: "",
    descp: "",
    type: "",
    date: "",
    time: "",
    location: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const payload = {
        ...act,
        date: act.date ? act.date.toString() : "", // or use .toISOString() for consistency
        id:id,
      }
      
      const res = await axios.post("http://localhost:3000/api/Add_activity", payload)
      alert(res.data.message)
      setact({
        title: "",
        descp: "",
        type: "",
        date: "",
        time: "",
        location: "",
      })
      router.push("/dashboard")
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Error creating activity, please try again later"
      )
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }
    
  const mapRef = useRef(null);
  const inputRef = useRef(null);
  const [map, setMap] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
   const [distanceInfo, setDistanceInfo] = useState(null);

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

  if ( curr) {
    loadScript(goMapsUrl)
      .then(() => initMap())
      .catch((err) => console.error("Map load failed:", err));
  }
}, [ curr]);
  // Initialize the map and autocomplete
  const initMap = () => { const defaultCenter = { lat: 28.6139, lng: 77.2090 }; // Delhi
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
      } else {
        console.error("Geocode failed for current user:", status);
        alert("Could not find your location. Please enter a valid address.");
      }
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

      // Update React state with the selected place
      setact((prev) => ({
        ...prev,
        location: place.name || "",
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
    origin: currLatLng ?? defaultCenter,
    destination: destination,
    travelMode: window.google.maps.TravelMode.DRIVING,
    provideRouteAlternatives: true,
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
  const center={lat: 28.7100, lng: 77.2604} // Example coordinates for New York City

  return (
   <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-100 to-indigo-100 flex flex-col">
      {/* Main Content */}
      <div className="flex flex-1 w-full max-w-7xl mx-auto py-8 px-4 gap-8 flex-col md:flex-row">
        {/* Map Section */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
          <div
            ref={mapRef}
            className="w-full h-[400px] md:h-[500px] rounded-2xl shadow-xl overflow-hidden border border-blue-100 bg-slate-200 flex items-center justify-center"
          >
            {/* Map will render here */}
          </div>

          {distanceInfo && (
            <div className="mt-4 bg-blue-50 p-4 rounded-lg text-sm text-gray-800 w-full">
              <p>📍 <strong>Destination:</strong> {distanceInfo.end_address}</p>
              <p>📏 <strong>Distance:</strong> {distanceInfo.distance}</p>
              <p>🕒 <strong>Estimated Time:</strong> {distanceInfo.duration}</p>
            </div>
          )}

          <div className="mt-4 text-center text-gray-500 text-sm w-full">
            Map preview. Select a location in the form to update.
          </div>
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2">
          <Card className="shadow-2xl border-0 rounded-2xl bg-white/95">
            <CardHeader>
              <CardTitle className="text-2xl text-slate-800 font-bold">Create New Activity</CardTitle>
              <CardDescription className="text-slate-600">
                Plan an activity and invite fellow travelers to join you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Activity Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Central Park Photography Walk"
                    value={act.title}
                    onChange={(e) => setact({ ...act, title: e.target.value })}
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your activity, what to expect, what to bring..."
                    value={act.descp}
                    onChange={(e) => setact({ ...act, descp: e.target.value })}
                    rows={4}
                  />
                </div>

                {/* Type */}
                <div className="space-y-2">
                  <Label>Activity Type *</Label>
                  <Select
                    value={act.type}
                    onValueChange={(value) => setact({ ...act, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select activity type" />
                    </SelectTrigger>
                    <SelectContent>
                      {activityTypes.map((type) => (
                        <SelectItem key={type} value={type.toLowerCase()}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal bg-transparent"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {act.date ? format(act.date, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={act.date}
                          onSelect={(date) => setact({ ...act, date })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Time *</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="time"
                        type="time"
                        value={act.time}
                        onChange={(e) => setact({ ...act, time: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="location"
                      placeholder="Enter meeting location"
                      ref={inputRef}
                      defaultValue={act.location}
                      onChange={(e) => setact({ ...act, location: e.target.value })}
                      className="pl-10"
                      required
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    Be specific (e.g., "Central Park - Bethesda Fountain")
                  </p>
                </div>

                {/* Submit Buttons */}
                <div className="flex space-x-4 pt-4">
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? "Creating..." : "Create Activity"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default page
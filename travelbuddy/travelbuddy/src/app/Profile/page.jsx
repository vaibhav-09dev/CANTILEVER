"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, MapPin, User } from "lucide-react"
import axios from "axios"

const page = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [curr, setcurr] = useState({})
  const [id, setid] = useState("")
  const router = useRouter()

  const [formData, setFormData] = useState({
    pic: "/placeholder.svg?height=100&width=100",
    about: "",
    location: "",
    age: "",
    occupation: "",
  })

  useEffect(() => {
    const storedid = sessionStorage.getItem("id")
    if (storedid) {
      setid(storedid)
      fetchcurrent(storedid)
    }
  }, [])

  const fetchcurrent = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/Current_user?id=${userId}`)
      setcurr(res.data.data)
    } catch (error) {
      console.error("Error fetching user:", error)
    }
  }

  useEffect(() => {
    if (curr && Object.keys(curr).length > 0) {
      setFormData((prev) => ({
        ...prev,
        pic: curr.pic || "/placeholder.svg?height=100&width=100",
        about: curr.about || "",
        location: curr.location || "",
        age: curr.age || "",
        occupation: curr.occupation || "",
      }))
    }
  }, [curr])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await axios
        .post(`http://localhost:3000/api/Edit`, { ...formData, id: id })
        .then((res) => {
          alert(res.data.message)
          router.push("/dashboard")
          setIsLoading(false)
        })
        .catch((error) => {
          alert(error.response?.data?.message || "Something went wrong")
          setIsLoading(false)
        })
    } catch (error) {
      alert("Something went wrong")
      setIsLoading(false)
    }
  }

  // 🌍 MAP INTEGRATION
  const mapRef = useRef(null)
  const inputRef = useRef(null)
  const [map, setMap] = useState(null)
  const [directionsRenderer, setDirectionsRenderer] = useState(null)

  const goMapsUrl = `https://maps.gomaps.pro/maps/api/js?key=${ process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`

  useEffect(() => {
    const loadScript = (url) => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${url}"]`)) {
          resolve()
          return
        }
        const script = document.createElement("script")
        script.src = url
        script.async = true
        script.defer = true
        script.onload = resolve
        script.onerror = reject
        document.body.appendChild(script)
      })
    }

    if (curr) {
      loadScript(goMapsUrl)
        .then(() => initMap())
        .catch((err) => console.error("Map load failed:", err))
    }
  }, [curr])

  const initMap = () => {
    const defaultCenter = { lat: 28.6139, lng: 77.2090 } // Delhi
    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: 10,
    })

    setMap(mapInstance)

    const geocoder = new window.google.maps.Geocoder()
    const directionsService = new window.google.maps.DirectionsService()
    let directionsRenderer = null
    let currLatLng = null

    if (curr?.location) {
      geocoder.geocode({ address: curr.location }, (results, status) => {
        if (status === "OK" && results[0]) {
          currLatLng = results[0].geometry.location
          new window.google.maps.Marker({
            map: mapInstance,
            position: currLatLng,
            title: "You",
          })
          mapInstance.setCenter(currLatLng)
        } else {
          console.error("Geocode failed:", status)
        }
      })
    }

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current)
    autocomplete.bindTo("bounds", mapInstance)

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace()
      if (!place.geometry || !place.geometry.location) {
        alert("No details available for input.")
        return
      }

      setFormData((prev) => ({
        ...prev,
        location: place.name || "",
      }))

      const destination = place.geometry.location
      if (directionsRenderer) {
        directionsRenderer.setMap(null)
      }

      const newDirectionsRenderer = new window.google.maps.DirectionsRenderer()
      newDirectionsRenderer.setMap(mapInstance)
      setDirectionsRenderer(newDirectionsRenderer)

      directionsService.route(
        {
          origin: currLatLng ?? defaultCenter,
          destination: destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK") {
            newDirectionsRenderer.setDirections(result)
          } else {
            alert("Directions request failed due to " + status)
          }
        }
      )
    })
  }

  // 📸 IMAGE UPLOAD
  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        pic: reader.result, // base64
      }))
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-100 to-indigo-100 py-5">
  <div className="w-full max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-6">
    
    {/* Left Map (Full width on mobile) */}
    <div className="w-full lg:w-2/3">
      <div
        ref={mapRef}
        className="w-full h-96 lg:h-full rounded-lg border border-blue-100 bg-slate-200 shadow"
      />
    </div>

    {/* Right Profile */}
    <div className="w-full lg:w-2/3">
      <Card className="shadow-2xl border-0 rounded-3xl bg-white/95">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl sm:text-3xl font-bold text-blue-700">
            Your Profile
          </CardTitle>
          <CardDescription className="text-sm sm:text-base text-gray-500">
            Help other travelers know you better
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Avatar */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="h-28 w-28 border-4 border-blue-200 shadow-lg">
                  <AvatarImage src={formData.pic} />
                  <AvatarFallback>
                    <User className="h-14 w-14 text-blue-400" />
                  </AvatarFallback>
                </Avatar>
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  id="avatar-upload"
                  onChange={handleImageUpload}
                />
                <Button
                  type="button"
                  onClick={() => document.getElementById("avatar-upload").click()}
                  className="absolute bottom-0 right-0 rounded-full text-black bg-white shadow hover:bg-blue-50"
                >
                  <Camera className="h-4 w-4 mr-1" />
                  Upload
                </Button>
              </div>
            </div>

            {/* About Me */}
            <div>
              <Label htmlFor="about" className="text-lg font-semibold">
                About Me
              </Label>
              <Textarea
                id="about"
                placeholder="Tell us about yourself..."
                value={formData.about}
                onChange={(e) =>
                  setFormData({ ...formData, about: e.target.value })
                }
                rows={4}
                className="mt-2 rounded-lg border-gray-300"
              />
            </div>

            {/* Location + Age */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="location" className="text-lg font-semibold">
                  Current Location
                </Label>
                <div className="relative mt-2">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input
                    id="location"
                    placeholder="e.g., New Delhi"
                    ref={inputRef}
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="age" className="text-lg font-semibold">
                  Age
                </Label>
                <Input
                  id="age"
                  type="number"
                  min="18"
                  max="100"
                  value={formData.age}
                  onChange={(e) =>
                    setFormData({ ...formData, age: e.target.value })
                  }
                  className="mt-2"
                />
              </div>
            </div>

            {/* Occupation */}
            <div>
              <Label htmlFor="occupation" className="text-lg font-semibold">
                Occupation
              </Label>
              <Input
                id="occupation"
                placeholder="e.g., Student, Developer"
                value={formData.occupation}
                onChange={(e) =>
                  setFormData({ ...formData, occupation: e.target.value })
                }
                className="mt-2"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full py-3 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition"
              disabled={isLoading}
            >
              {isLoading ? "Saving Profile..." : "Edit Profile"}
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

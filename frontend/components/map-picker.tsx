"use client"

import React, { useEffect, useRef } from "react"

type MapPickerProps = {
  apiKey?: string
  value?: { lat: number; lng: number }
  onChange?: (pos: { lat: number; lng: number }) => void
  height?: number
}

export default function MapPicker({ apiKey, value, onChange, height = 300 }: MapPickerProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const markerRef = useRef<any>(null)

  useEffect(() => {
    if (!ref.current) return
    const windowAny: any = window
    const load = async () => {
      if (!windowAny.google && apiKey) {
        const script = document.createElement("script")
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
        script.async = true
        document.head.appendChild(script)
        await new Promise((res) => (script.onload = res))
      }
      if (!windowAny.google) return
      const google = windowAny.google
      const center = value ? { lat: value.lat, lng: value.lng } : { lat: 30.3573, lng: 76.0700 }
      const map = new google.maps.Map(ref.current, { center, zoom: 12 })
      markerRef.current = new google.maps.Marker({ position: center, map, draggable: true })
      markerRef.current.addListener("dragend", () => {
        const pos = markerRef.current.getPosition()
        const lat = pos.lat()
        const lng = pos.lng()
        onChange && onChange({ lat, lng })
      })
    }
    load()
  }, [apiKey])

  useEffect(() => {
    const windowAny: any = window
    if (!markerRef.current) return
    if (value && windowAny.google) {
      const pos = new windowAny.google.maps.LatLng(value.lat, value.lng)
      markerRef.current.setPosition(pos)
    }
  }, [value])

  return <div ref={ref} style={{ width: "100%", height }} />
}

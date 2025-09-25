"use client"

import React, { useEffect, useRef } from 'react'

type Address = {
  formatted?: string
  street?: string
  city?: string
  state?: string
  pincode?: string
  lat?: number
  lng?: number
}

function loadScript(src: string, id = 'google-maps') {
  return new Promise<void>((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('window is undefined'))
    if (document.getElementById(id)) return resolve()
    const s = document.createElement('script')
    s.src = src
    s.id = id
    s.async = true
    s.defer = true
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('Failed to load script'))
    document.head.appendChild(s)
  })
}

export default function AddressAutocomplete({
  value,
  onChange,
  placeholder = 'Start typing an address',
  apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
}: {
  value?: string
  onChange: (addr: Address) => void
  placeholder?: string
  apiKey?: string
}) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const autoRef = useRef<any>(null)

  useEffect(() => {
    if (!apiKey) return
    const src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=weekly`
    let mounted = true
    loadScript(src, 'google-places')
      .then(() => {
        if (!mounted) return
        if (!inputRef.current) return
        // @ts-ignore
        const googleObj = (window as any).google
        if (!googleObj || !googleObj.maps || !googleObj.maps.places) return
        // @ts-ignore
        autoRef.current = new googleObj.maps.places.Autocomplete(inputRef.current, { types: ['geocode'] })
        autoRef.current.addListener('place_changed', () => {
          const place = autoRef.current.getPlace()
          if (!place) return
          const addr: Address = { formatted: place.formatted_address }
          const comp = (place.address_components || [])
          comp.forEach((c: any) => {
            const types = c.types || []
            if (types.includes('street_number')) {
              addr.street = `${c.long_name}${addr.street ? ' ' + addr.street : ''}`
            }
            if (types.includes('route')) {
              addr.street = `${addr.street ? addr.street + ' ' : ''}${c.long_name}`.trim()
            }
            if (types.includes('locality') || types.includes('sublocality') || types.includes('postal_town')) {
              addr.city = c.long_name
            }
            if (types.includes('administrative_area_level_1')) {
              addr.state = c.long_name
            }
            if (types.includes('postal_code')) {
              addr.pincode = c.long_name
            }
          })
          if (place.geometry && place.geometry.location) {
            addr.lat = place.geometry.location.lat()
            addr.lng = place.geometry.location.lng()
          }
          onChange(addr)
        })
      })
      .catch(() => {
        // ignore script load errors for demo mode
      })
    return () => { mounted = false }
  }, [apiKey, onChange])

  return (
    <input
      ref={inputRef}
      defaultValue={value}
      className="w-full border rounded px-3 py-2"
      placeholder={placeholder}
      aria-label="address-autocomplete"
    />
  )
}

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import posthog from 'posthog-js'
import './index-light.css'
import App from './App.jsx'

posthog.init('phc_cc1bwpzA7VZrM9gb0VyA5WjvLXoECC2SpYJz70F44IE', {
  api_host: 'https://us.i.posthog.com',
  defaults: '2026-01-30',
  person_profiles: 'identified_only',
  capture_pageview: true,
  capture_pageleave: true,
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

import React from 'react'
import ReactDOM from 'react-dom/client'
import posthog from 'posthog-js'
import App from './App.tsx'
import './index.css'

posthog.init('phc_cc1bwpzA7VZrM9gb0VyA5WjvLXoECC2SpYJz70F44IE', {
  api_host: 'https://us.i.posthog.com',
  defaults: '2026-01-30',
  person_profiles: 'identified_only',
  capture_pageview: true,
  capture_pageleave: true,
  session_recording: {},
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

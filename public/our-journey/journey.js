// ============================================================
//  EDIT THIS FILE to change everything on the page.
//  Photos go in the  photos/  folder next to this file,
//  then list them by filename, e.g. photos: ["first-call.jpg"]
// ============================================================

window.JOURNEY = {
  her: "Pranali",
  me: "Manas",
  title: "Manas & Pranali",
  subtitle: "Every station on the way to forever",
  birthdayNote: "Happy Birthday, Pranali ❤️",   // set to "" to hide

  // Date format: "YYYY-MM-DD". Leave date as "" until you have it.
  // Stations are shown in the order listed. Future dates show as "upcoming"
  // and the next milestone gets a live countdown.
  //   milestone: true  → gold station + fireworks & party poppers
  //   blank: true      → an "empty page" memory still to be made
  stops: [
    { date: "", icon: "🌹", title: "Our 1st date",
      text: "Where we went, what we talked about...", photos: [] },

    { date: "", icon: "☕", title: "Our 2nd date",
      text: "Write the story here.", photos: [] },

    { date: "", icon: "🍿", title: "Our 3rd date",
      text: "Write the story here.", photos: [] },

    { date: "", icon: "👨‍👩‍👧", title: "First family meet",
      text: "The first time our families met.", photos: [] },

    { date: "", icon: "👨‍👩‍👧‍👦", title: "First complete family meet",
      text: "Everyone, together for the first time.", photos: [] },

    { date: "", icon: "💕", title: "Many more dates",
      text: "And then we just couldn't stop meeting...", photos: [] },

    { date: "", icon: "🛍️", title: "Pune meetup for shopping",
      text: "Write the story here.", photos: [] },

    { date: "", icon: "🍦", title: "Pune hangout at FC Road",
      text: "Write the story here.", photos: [] },

    { date: "", icon: "🚉", title: "Solapur meetup",
      text: "Write the story here.", photos: [] },

    { date: "2026-11-15", icon: "💍", title: "Our Engagement",
      text: "The day we make it official.", photos: [], milestone: true },

    { date: "", icon: "✏️", title: "A memory we haven't made yet",
      text: "This page is still empty. We'll fill it together.", photos: [], blank: true },

    { date: "", icon: "✏️", title: "Another one, waiting for us",
      text: "Somewhere between the ring and the mandap...", photos: [], blank: true },

    { date: "", icon: "✏️", title: "And one more...",
      text: "Blank for now, but not for long.", photos: [], blank: true },

    { date: "2027-07-09", icon: "💒", title: "Our Wedding",
      text: "The last station of this line, and the start of a new one.", photos: [], milestone: true }
  ]
};

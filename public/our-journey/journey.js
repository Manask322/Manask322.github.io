// ============================================================
//  EDIT THIS FILE to change everything on the page.
//  Photos go in the  photos/  folder next to this file,
//  then list them by filename, e.g. photos: ["first-call.jpg"]
// ============================================================

window.JOURNEY = {
  her: "Her Name",          // shown in the title
  me: "Manas",
  title: "Our Journey",
  subtitle: "Every station on the way to forever",
  birthdayNote: "Happy Birthday, my love ❤️",   // set to "" to hide

  // Date format: "YYYY-MM-DD". Stations are shown in the order listed.
  // Stations with a future date automatically show as "upcoming"
  // and the next one gets a live countdown.
  stops: [
    {
      date: "2025-01-01",
      title: "The first hello",
      text: "Where we started talking. Write the story here.",
      photos: [],
      icon: "💬"
    },
    {
      date: "2025-02-01",
      title: "The day we first met",
      text: "Where, what you wore, what I thought...",
      photos: [],
      icon: "☕"
    },
    {
      date: "2025-06-01",
      title: "A memory to add",
      text: "Placeholder: a trip, a date, a silly moment.",
      photos: [],
      icon: "📸"
    },
    {
      date: "2026-11-15",
      title: "Our Engagement",
      text: "The day we make it official.",
      photos: [],
      icon: "💍",
      milestone: true
    },
    {
      date: "2027-03-01",
      title: "New memories ahead",
      text: "We'll fill this in together.",
      photos: [],
      icon: "✨"
    },
    {
      date: "2027-07-01",       // update with the exact wedding date
      title: "Our Wedding",
      text: "The last station of this line, and the start of a new one.",
      photos: [],
      icon: "💒",
      milestone: true
    }
  ]
};

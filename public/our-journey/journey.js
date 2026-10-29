// ============================================================
//  EDIT THIS FILE to change everything on the page.
//  Photos live in the  photos/  folder. List them by name without
//  ".jpg", e.g. photos: ["first_trip"] (each has a small "-t" thumbnail
//  next to it, made by the photo script).
// ============================================================

window.JOURNEY = {
  her: "Pranali",
  me: "Manas",
  title: "Manas & Pranali",
  subtitle: "Every station on the way to forever",
  birthdayNote: "Happy Birthday, Pranali ❤️",   // set to "" to hide

  // Background music: put an mp3 in the music/ folder and write its path,
  // e.g. "music/our-song.mp3". Leave "" for the built-in music-box tune.
  music: "music/song.mp3",

  // The surprise at the very end of the track: a gift box she taps to open.
  // Each line of the poem appears one after another; the last line glows.
  finale: {
    hint: "One last thing, at the end of the line...",
    button: "Tap to open your surprise 🎁",
    poem: "Mazya Swashat tu\nHrudayat tu\nKarmat tu\nKartarwyat tu\nTuzya bina mi kahich nahi\nTuza mi ani mazi tu\n\nI LOVE YOU ❤️"
  },

  // Date format: "YYYY-MM-DD". Leave date as "" until you have it.
  // Stations are shown in the order listed. Future dates show as "upcoming"
  // and the next milestone gets a live countdown.
  //   milestone: true  → gold station + fireworks & party poppers
  //   blank: true      → an "empty page" memory still to be made
  //   letter: "..."    → an envelope on the track after this stop; it opens
  //                      by itself once she scrolls past, or when tapped
  //   { misc: [...] }  → little polaroids tucked between stations
  //   dateLabel: "..." → show this instead of the date (e.g. a date range)
  stops: [
    { date: "2026-06-25", icon: "💬", title: "Our 1st meet",
      text: "Where it all began.", photos: [] },

    { date: "2026-06-28", icon: "☕", title: "Our 2nd meet",
      text: "And then we met again.", photos: ["2_meet"] },

    { date: "2026-07-05", icon: "🌿", title: "Our 3rd meet",
      text: "Third time's the charm.", photos: ["3_meet", "3_meet_2"],
      letter: "I was sure the day I met you but it felt like a dream ! how can I get someone so compatible and caring <3. I saw a friend in you with whom I can spend my complete day out. You felt like someone I have known from ages already. Thank you for coming into my life." },

    { date: "2026-07-19", icon: "👨‍👩‍👧", title: "First family meet",
      text: "Our families, together for the first time.", photos: ["first_family_meet"],
      letter: "This is when I truly fall in love with you, you were more than a friend and I looked at you as someone who I would want to spend my life with. I saw my marathi bride that day !!" },

    { misc: ["misc"] },

    { date: "2026-07-28", icon: "🎤", title: "The mic moment",
      text: "", photos: ["mic"] },

    { misc: ["misc_after_first_family_meet"] },

    { date: "2026-08-08", icon: "🏙️", title: "First day in HSR",
      text: "", photos: ["first_day_hsr"] },

    { misc: ["misc_1"] },

    { date: "2026-08-13", icon: "💼", title: "The office date",
      text: "", photos: ["office_date"] },

    { date: "2026-08-13", icon: "🌆", title: "A day out",
      text: "", photos: ["day_out", "day_out_"] },

    { date: "2026-08-14", icon: "☕", title: "Coffee makers",
      text: "", photos: ["coffee_makers", "coffe_makers_1"] },

    { date: "2026-08-14", icon: "🔑", title: "The lost-key kand",
      text: "", photos: ["key_lost_kand"] },

    { date: "2026-08-15", icon: "📔", title: "HSR diaries",
      text: "", photos: ["hsr_diaries"] },

    { date: "2026-08-16", icon: "🌹", title: "Our first date",
      text: "", photos: ["first_date"] },

    { date: "2026-08-18", icon: "🎁", title: "My gift",
      text: "", photos: ["my_gift"] },

    { date: "2026-08-26", icon: "👨‍👩‍👧‍👦", title: "First complete family meet",
      text: "Everyone, together.", photos: ["final_complete_family_meet"],
      letter: "It was hard when families meet and friction between them but we fought all of it and this is when I realised that in any ups and downs in life you are the sukoon of my life and my destiny. \"Jeena Yaha Marna Yaha Tera Bina Ab Jana Kaha\"" },

    { misc: ["misc_2"] },

    { date: "2026-09-19", icon: "🧳", title: "Our first trip",
      text: "", photos: ["first_trip", "fist_trip_1", "fist_trip_2", "fist_trip_3", "fist_trip_4", "fist_trip_5"] },

    { date: "2026-09-23", icon: "💕", title: "Many more dates",
      text: "And then we just couldn't stop meeting...", photos: ["misc_date_5", "misc_date_5_1", "misc_date_6"] },

    { date: "2026-09-27", icon: "🌃", title: "HSR date",
      text: "", photos: ["hsr_date"] },

    { date: "2026-10-01", icon: "🥂", title: "Meeting the friends",
      text: "", photos: ["friends_meetup", "friends_meetup_1"] },

    { date: "2026-10-02", icon: "✈️", title: "Our first flight",
      text: "", photos: ["first_flight", "first_flight_1"] },

    { date: "2026-10-17", icon: "🛍️", title: "Pune meetup for shopping",
      text: "", photos: ["pune_shopping"] },

    { date: "2026-10-18", dateLabel: "18 – 19 October 2026", icon: "🍦", title: "Pune hangout at FC Road",
      text: "", photos: ["pune_date", "pune_date_1", "pune_date_2"],
      letter: "In Pune, I saw a different version of you, someone who is ready to spend her complete life with me, someone who cares a lot about me, is responsible and ready to create a new family of her own. I saw a girl transform into a woman. The woman of my dreams. \"Meri Pasandita Aurat :p\"" },

    { date: "2026-10-31", icon: "🚉", title: "Solapur meetup",
      text: "Keep the 31st free... someone might be catching a train 😉", photos: [] },

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

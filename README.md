# 🛡️ TWLT Script for TribalWars

This repository hosts the **TWLT (TribalWars Loot Tool)**

*   This script creates a floating UI widget that synchronizes with a server clock and displays a countdown to a user-defined launch time. It uses performance timing to maintain precision and provides visual feedback via a rotating clock hand and millisecond display.

---

## ⚙️ How to Use

To use the script in your TribalWars Quickbar:

1. Open your **Settings** in TribalWars.
2. Navigate to the **Quickbar** section.
3. Add a new link with the following code:

   ```javascript
   javascript:(function(){
     var s = document.createElement('script');
     s.src = 'https://cdn.jsdelivr.net/gh/Kyohatsu/TW-Scripts/TWLT.js';
     document.body.appendChild(s);
   })();

4. Name it something like TWLT Tool and save.

*  Once added, clicking the Quickbar link will load the script instantly.

---

# 🧠 Features

•  One-click activation from Quickbar

•  Optimized looting interface

•  Lightweight and secure

•  CDN-hosted for fast delivery

---

# 📜 Script Source

•  The script is hosted via jsDelivr CDN and pulls directly from this GitHub repository:

```javascript
   https://cdn.jsdelivr.net/gh/Kyohatsu/TW-Scripts/TWLT.js


/**
 * TW Launcher Tool v1
 * ------------------
 * Author: Kyohatsu.
 * Created: August 14, 2025
 * Description:
 *   This script creates a floating UI widget that synchronizes with a server clock
 *   and displays a countdown to a user-defined launch time. It uses performance timing
 *   to maintain precision and provides visual feedback via a rotating clock hand and
 *   millisecond display.
 *
 * Reminder:
 *   Please obtain permission from the author (Kyohatsu.) before modifying or redistributing
 *   this script. Respect the creator's work and intellectual property.
 */

(function(){
  let running = false;
  let syncStartPerf = 0;
  let syncStartTime = null;
  let launchMs = null;

  function getPreciseServerMs() {
    if (!syncStartPerf || !syncStartTime) return null;
    const elapsed = performance.now() - syncStartPerf;
    return syncStartTime + elapsed;
  }

  function updateClock() {
    const msDisplay = document.getElementById("tw-ms-display");
    const hand = document.getElementById("tw-clock-hand");
    const countdownDisplay = document.getElementById("tw-countdown");

    if (running && syncStartPerf && syncStartTime !== null && launchMs !== null) {
      const preciseMs = getPreciseServerMs();
      const ms = preciseMs % 1000;
      const deg = (ms / 1000) * 360;
      if (msDisplay) msDisplay.textContent = Math.floor(ms);
      if (hand) hand.style.transform = `rotate(${deg}deg)`;

      const diff = launchMs - preciseMs;

      if (diff > 0) {
        const seconds = Math.floor(diff / 1000);
        const msLeft = Math.floor(diff % 1000);
        countdownDisplay.textContent = `Launch in: ${seconds}s ${msLeft}ms`;
      } else if (diff > -1000) {
        countdownDisplay.textContent = `Launch now!`;
      } else {
        countdownDisplay.textContent = `Missed launch window`;
      }
    }

    requestAnimationFrame(updateClock);
  }

  function calibrate(callback) {
    let lastTime = document.getElementById("serverTime")?.textContent || "";
    const loop = setInterval(() => {
      const time = document.getElementById("serverTime")?.textContent;
      if (time && time !== lastTime) {
        clearInterval(loop);
        const [hh, mm, ss] = time.split(":").map(Number);
        const msSinceMidnight = ((hh * 3600) + (mm * 60) + ss) * 1000;
        callback(performance.now(), msSinceMidnight);
      }
    }, 10);
  }

  const box = document.createElement("div");
  box.id = "tw-snipe-sync";
  box.style = `
    position:fixed; top:120px; left:120px; z-index:9999;
    width:240px; height:auto; background:#222; border:2px solid #555;
    padding:16px; border-radius:12px; box-shadow:2px 2px 10px rgba(255,255,255,0.1);
    font-family:'Courier New'; display:flex; flex-direction:column;
    align-items:center; color:#eee;
  `;

  let markers = "";
  for (let i = 0; i < 10; i++) {
    const angle = (i * 36) - 90;
    const size = i === 5 ? 14 : 10;
    const weight = i === 5 ? 4 : 2;
    markers += `<div style="
      position:absolute;
      width:${weight}px;
      height:${size}px;
      background:#eee;
      top:50%;
      left:50%;
      transform:rotate(${angle}deg) translateY(-60px);
      transform-origin:center;"></div>`;
  }

  box.innerHTML = `
    <div style="position:absolute; top:6px; right:8px; cursor:pointer; font-weight:bold; color:#f55;" id="tw-close-btn">×</div>
    <div style="font-weight:bold; color:#0cf; font-size:16px; margin-bottom:12px; margin-top:24px;">
      TW Launcher Tool v1
    </div>
    <div style="position:relative;width:120px;height:120px;border-radius:50%; margin-bottom:16px;">
      ${markers}
      <div id="tw-ms-display" style="position:absolute;width:100%;top:38%;text-align:center;font-weight:bold;">000</div>
      <div id="tw-clock-hand" style="
        position:absolute;width:2px;height:40px;background:#f33;
        top:20px;left:59px;transform-origin:bottom center;"></div>
    </div>
    <input id="tw-time-input" type="text" placeholder="HH:MM:SS.mmm" style="
      width:140px;text-align:center;margin-bottom:10px;
      background:#333; color:#eee; border:1px solid #666; padding:4px;" />
    <div id="tw-countdown" style="font-size:13px;font-weight:bold; margin-bottom:10px;">Countdown: --</div>
    <button id="tw-sync-btn" style="
      background:#444; color:#eee; border:1px solid #666;
      padding:6px 12px; border-radius:6px; cursor:pointer; margin-bottom:12px;">Start</button>
    <div style="font-size:10px; color:#aaa;">Created by Kyohatsu</div>
  `;
  document.body.appendChild(box);

  document.getElementById("tw-sync-btn").onclick = function() {
    running = !running;
    const btn = this;
    if (running) {
      btn.textContent = "Syncing…";
      calibrate((perfTime, serverMs) => {
        syncStartPerf = perfTime;
        syncStartTime = serverMs;
        btn.textContent = "Stop";

        const input = document.getElementById("tw-time-input").value.trim();
        const match = input.match(/^(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?$/);
        if (match) {
          const hh = parseInt(match[1]);
          const mm = parseInt(match[2]);
          const ss = parseInt(match[3]);
          const ms = parseInt(match[4] || "0");
          launchMs = ((hh * 3600) + (mm * 60) + ss) * 1000 + ms;
        } else {
          launchMs = null;
          alert("Invalid time format. Use HH:MM:SS.mmm");
        }
      });
    } else {
      btn.textContent = "Start";
      launchMs = null;
    }
  };

  document.getElementById("tw-close-btn").onclick = function() {
    box.remove();
  };

  box.onmousedown = function(e) {
    const ox = e.clientX - box.offsetLeft, oy = e.clientY - box.offsetTop;
    document.onmousemove = e => {
      box.style.left = (e.clientX - ox) + "px";
      box.style.top = (e.clientY - oy) + "px";
    };
    document.onmouseup = () => {
      document.onmousemove = null;
      document.onmouseup = null;
    };
  };

  requestAnimationFrame(updateClock);
})();

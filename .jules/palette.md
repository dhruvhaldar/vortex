
## 2024-05-18 - Respecting Reduced Motion Preferences in Overlays
**Learning:** Continuous looping animations, such as `animate-bounce` used for "Scroll to explore" indicators, can cause nausea or dizziness for users with vestibular disorders, especially when layered over dynamic or moving 3D scenes (like React Three Fiber).
**Action:** Always wrap continuous CSS animations with the `motion-safe:` variant (e.g., `motion-safe:animate-bounce`) to ensure the animation only plays for users who have not requested reduced motion in their OS settings.

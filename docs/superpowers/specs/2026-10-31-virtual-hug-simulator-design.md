# Virtual Hug Simulator Design Spec

**Intent:** A cozy, interactive web experience where people can customize characters and share hugs with animation, sound, and both 2D and 3D viewing modes. Real-time via sockets.

**Goals:**
- 2D cozy hug scene with animations
- Optional 3D view mode (Three.js)
- Character customization (avatar builder)
- Multiple hug types with unique animations/sounds
- Real-time networking via Socket.io (send/receive hugs)
- Sound effects
- Cozy aesthetic

**Non-goals:**
- Not a competitive game
- Not full VR (3D is bonus visual mode only)

**Anti-goals:**
- Not cold/clinical design (must feel warm and cozy)
- Not broken offline (works solo too)

**Features (maxed out):**
- Character builder (hair, clothes, colors)
- Hug types: Bear Hug, Gentle Hug, Warm Hug, Friend Hug, Happy Hug, Cozy Hug, Surprise Hug, Long Hug
- 2D canvas animations with sprites
- 3D Three.js scene with the same characters
- Socket.io room for live hugs
- Sound player with volume control and multiple soundtracks
- Custom hug messages
- Particle effects (hearts/confetti)
- Dark/cozy theme toggle
- Character save/load
- Hug counter/history

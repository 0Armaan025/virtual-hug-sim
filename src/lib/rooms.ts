// Room info tracking (client-side mirror from server events)
export interface RoomInfo {
  id: string;
  name: string;
  playerCount: number;
  onlineCount: number;
  createdAt: number;
}

export function formatRoomName(id: string): string {
  return id.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
}

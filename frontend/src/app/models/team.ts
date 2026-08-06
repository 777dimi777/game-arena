export interface TeamOwner {
  id: number;
  username?: string;
  email?: string;
}

export interface Team {
  id: number;
  name: string;
  tag: string;
  logoUrl?: string;
  description?: string;
  owner?: TeamOwner | null;
}

export interface Application {
  id: string;
  name: string;
  description: string;
  url?: string;
  status: "active" | "inactive";
  createdAt: string;
}

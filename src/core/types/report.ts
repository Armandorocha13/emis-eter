export interface Report {
  id: string;
  title: string;
  slug: string;
  icon?: string;
  filename: string;
  description?: string;
  stats?: {
    count: number;
    lastUpdate: string;
  };
}

export type EonetCategory = {
  id?: string | number;
  title?: string;
};

export type EonetSource = {
  id?: string;
  url?: string;
};

export type EonetGeometry = {
  magnitudeValue?: number | null;
  magnitudeUnit?: string | null;
  date?: string;
  type?: string;
  coordinates?: number[] | number[][];
};

export type EonetEvent = {
  id?: string;
  title?: string;
  description?: string | null;
  link?: string;
  closed?: string | null;
  categories?: EonetCategory[];
  sources?: EonetSource[];
  geometry?: EonetGeometry[];
};

export type EonetEventsResponse = {
  title?: string;
  description?: string;
  link?: string;
  events?: EonetEvent[];
};

export type Incident = {
  id: string;
  title: string;
  categories: string[];
  sources: EonetSource[];
  geometry: EonetGeometry[];
  mostRecentDate: string | null;
};

export type EonetApiErrorResponse = {
  message?: string;
  retry_after?: number;
};

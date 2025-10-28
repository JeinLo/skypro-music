export interface TrackType {
  _id: number;
  name: string;
  author: string;
  release_date: string;
  genre: string[];
  duration_in_seconds: number;
  album: string;
  logo: null | string;
  track_file: string;
  starred_user: number[];
  isLiked?: boolean;
}

export interface PlaylistSelectionType {
  _id: number;
  name: string;
  items: number[];
  owner: number[];
  __v: number;
}
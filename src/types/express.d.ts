declare namespace Express {
  export interface Request {
    user?: {
      id: string;
      steamId: string;
      leetifyId: string | null;
    };
  }
}
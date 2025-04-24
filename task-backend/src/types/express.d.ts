import { Request } from 'express';

declare module 'express' {
  export interface Request {
    tokenData?: { id: string; email: string };
  }
}

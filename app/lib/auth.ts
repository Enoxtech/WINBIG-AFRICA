import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'winbig-africa-jwt-secret-2026';

export interface ServerUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

export async function getServerUser(): Promise<ServerUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) return null;

    const payload = jwt.verify(token, JWT_SECRET) as {
      id: string;
      name: string;
      email: string;
      phone?: string;
      avatar?: string;
    };

    return {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      avatar: payload.avatar,
    };
  } catch {
    return null;
  }
}

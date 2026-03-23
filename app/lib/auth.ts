import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

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

    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    return {
      id: payload.id as string,
      name: payload.name as string,
      email: payload.email as string,
      phone: payload.phone as string | undefined,
      avatar: payload.avatar as string | undefined,
    };
  } catch {
    return null;
  }
}

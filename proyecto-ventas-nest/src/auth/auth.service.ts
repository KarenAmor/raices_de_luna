import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

export interface Usuario {
  id: number;
  nombre: string;
  telefono: string;
  password: string;
}

@Injectable()
export class AuthService {
  private readonly usuariosPath = path.join(process.cwd(), 'src/data/usuarios.json');
  private readonly jwtSecret = 'tu-secreto-jwt-super-seguro'; // En producción usar variable de entorno

  private leerUsuarios(): Usuario[] {
    try {
      const data = fs.readFileSync(this.usuariosPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async login(telefono: string, password: string): Promise<{ token: string; usuario: Omit<Usuario, 'password'> } | null> {
    const usuarios = this.leerUsuarios();
    const usuario = usuarios.find(u => u.telefono === telefono);

    if (!usuario) {
      return null;
    }

    // Para simplicidad, comparamos directamente las contraseñas
    // En producción deberías usar bcrypt.compare para contraseñas hasheadas
    if (usuario.password !== password) {
      return null;
    }

    // Generar token JWT
    const payload = { id: usuario.id, telefono: usuario.telefono, nombre: usuario.nombre };
    const token = jwt.sign(payload, this.jwtSecret, { expiresIn: '24h' });

    return {
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        telefono: usuario.telefono
      }
    };
  }

  verificarToken(token: string): any {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      return null;
    }
  }
}
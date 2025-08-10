import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: { telefono: string; password: string }) {
    const { telefono, password } = loginDto;

    if (!telefono || !password) {
      throw new HttpException('Teléfono y contraseña son requeridos', HttpStatus.BAD_REQUEST);
    }

    const resultado = await this.authService.login(telefono, password);

    if (!resultado) {
      throw new HttpException('Credenciales inválidas', HttpStatus.UNAUTHORIZED);
    }

    return {
      success: true,
      message: 'Login exitoso',
      data: resultado
    };
  }
}


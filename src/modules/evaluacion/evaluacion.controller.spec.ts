import { Test, TestingModule } from '@nestjs/testing';
import { EvaluacionController } from './evaluacion.controller';
import { EvaluacionService } from './evaluacion.service';
import { CreateEvaluacionDto } from './dto/create-evaluacion.dto';

const mockEvaluacionService = {
  getVideojuegosAsignados: jest.fn(),
  getEvaluacionesHechas: jest.fn(),
  getEvaluacionPorId: jest.fn(),
  getEvaluacionesPorVideojuego: jest.fn(),
  crearEvaluacion: jest.fn(),
};

describe('EvaluacionController', () => {
  let controller: EvaluacionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EvaluacionController],
      providers: [
        { provide: EvaluacionService, useValue: mockEvaluacionService },
      ],
    }).compile();

    controller = module.get<EvaluacionController>(EvaluacionController);
  });

  it('debería retornar videojuegos asignados', async () => {
    mockEvaluacionService.getVideojuegosAsignados.mockResolvedValue(['juego1']);
    const req = { user: { id: 1 } };
    const result = await controller.getVideojuegosAsignados(req);
    expect(result).toEqual(['juego1']);
    expect(mockEvaluacionService.getVideojuegosAsignados).toHaveBeenCalledWith(1);
  });

  it('debería retornar evaluaciones realizadas por jurado', async () => {
    mockEvaluacionService.getEvaluacionesHechas.mockResolvedValue(['eval1']);
    const req = { user: { id: 2 } };
    const result = await controller.getEvaluacionesHechas(req);
    expect(result).toEqual(['eval1']);
    expect(mockEvaluacionService.getEvaluacionesHechas).toHaveBeenCalledWith(2);
  });

  it('debería retornar evaluación por ID', async () => {
    mockEvaluacionService.getEvaluacionPorId.mockResolvedValue({ id: 5 });
    const result = await controller.getEvaluacionPorId('5');
    expect(result).toEqual({ id: 5 });
    expect(mockEvaluacionService.getEvaluacionPorId).toHaveBeenCalledWith(5);
  });

  it('debería retornar evaluaciones de un videojuego', async () => {
    mockEvaluacionService.getEvaluacionesPorVideojuego.mockResolvedValue(['evalA']);
    const result = await controller.getEvaluacionesPorVideojuego('10');
    expect(result).toEqual(['evalA']);
    expect(mockEvaluacionService.getEvaluacionesPorVideojuego).toHaveBeenCalledWith(10);
  });

  it('debería crear una nueva evaluación', async () => {
    const dto: CreateEvaluacionDto = {
      comentarios: 'Buen trabajo',
      rubricas: Array(6).fill({ id_criterio: 1, valoracion: 5 }),
    };
    mockEvaluacionService.crearEvaluacion.mockResolvedValue({ id: 12 });
    const req = { user: { id: 3 } };
    const result = await controller.crearEvaluacion('7', req, dto);
    expect(result).toEqual({ id: 12 });
    expect(mockEvaluacionService.crearEvaluacion).toHaveBeenCalledWith(3, 7, dto);
  });
});

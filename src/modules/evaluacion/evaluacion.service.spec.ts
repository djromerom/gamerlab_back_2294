import { Test, TestingModule } from '@nestjs/testing';
import { EvaluacionService } from './evaluacion.service';
import { PrismaService } from '../../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockPrisma = {
  videojuego: { findMany: jest.fn() },
  evaluacion: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  videojuegoAsignado: { findUnique: jest.fn() },
};

describe('EvaluacionService', () => {
  let service: EvaluacionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EvaluacionService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<EvaluacionService>(EvaluacionService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('getEvaluacionesHechas', () => {
    it('retorna evaluaciones filtradas por jurado', async () => {
      mockPrisma.evaluacion.findMany.mockResolvedValue([
        {
          id: 1,
          deleted: false,
          videojuego: { deleted: false, equipo: { deleted: false } },
          rubricas: [],
        },
      ]);

      const result = await service.getEvaluacionesHechas(1);
      expect(result).toHaveLength(1);
      expect(mockPrisma.evaluacion.findMany).toHaveBeenCalled();
    });
  });

  describe('getEvaluacionPorId', () => {
    it('lanza NotFound si la evaluación no existe', async () => {
      mockPrisma.evaluacion.findUnique.mockResolvedValue(null);

      await expect(service.getEvaluacionPorId(1)).rejects.toThrow(NotFoundException);
    });

    it('retorna evaluación si existe y no está eliminada', async () => {
      mockPrisma.evaluacion.findUnique.mockResolvedValue({
        id: 1,
        deleted: false,
        videojuego: { deleted: false, equipo: { deleted: false } },
        rubricas: [],
      });

      const result = await service.getEvaluacionPorId(1);
      expect(result.id).toBe(1);
    });
  });

  describe('crearEvaluacion', () => {
    it('lanza error si el videojuego no está asignado al jurado', async () => {
      mockPrisma.videojuegoAsignado.findUnique.mockResolvedValue(null);

      await expect(
        service.crearEvaluacion(1, 1, { comentarios: '', rubricas: [] }),
      ).rejects.toThrow(BadRequestException);
    });

    it('lanza error si ya fue evaluado', async () => {
      mockPrisma.videojuegoAsignado.findUnique.mockResolvedValue({ deleted: false });
      mockPrisma.evaluacion.findUnique.mockResolvedValue({ deleted: false });

      await expect(
        service.crearEvaluacion(1, 1, { comentarios: '', rubricas: [] }),
      ).rejects.toThrow(BadRequestException);
    });

    it('lanza error si no se envían exactamente 6 rubricas', async () => {
      mockPrisma.videojuegoAsignado.findUnique.mockResolvedValue({ deleted: false });
      mockPrisma.evaluacion.findUnique.mockResolvedValue(null);

      await expect(
        service.crearEvaluacion(1, 1, { comentarios: '', rubricas: [] }),
      ).rejects.toThrow(BadRequestException);
    });

    it('crea evaluación correctamente', async () => {
      mockPrisma.videojuegoAsignado.findUnique.mockResolvedValue({ deleted: false });
      mockPrisma.evaluacion.findUnique
        .mockResolvedValueOnce(null) // para validación
        .mockResolvedValueOnce({
          id: 99,
          deleted: false,
          videojuego: { deleted: false, equipo: { deleted: false } },
          rubricas: [],
        });
      mockPrisma.evaluacion.create.mockResolvedValue({});

      const dto = {
        comentarios: 'Buena lógica',
        rubricas: Array(6).fill({ id_criterio: 1, valoracion: 4 }),
      };

      const result = await service.crearEvaluacion(1, 1, dto);
      expect(result.id).toBe(99);
    });
  });
});

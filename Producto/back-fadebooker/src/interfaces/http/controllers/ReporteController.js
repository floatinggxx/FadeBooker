const GenerarReporteCitas = require('../../../application/usecases/generarReporteCitas');
const CitaRepository = require('../../../infraestructure/database/CitaRepositoryImpl');
const CitaService = require('../../../application/usecases/cita.service');
const ServicioRepository = require('../../../infraestructure/database/ServicioRepositoryImpl');
const UsuarioRepository = require('../../../infraestructure/database/UsuarioRepositoryImpl');

const citaRepository = new CitaRepository();
const servicioRepository = new ServicioRepository();
const usuarioRepository = new UsuarioRepository();
const citaService = new CitaService(citaRepository, servicioRepository, usuarioRepository);

class ReporteController {
    async getDashboardStats(req, res) {
        try {
            const { tiendaId } = req.query;
            if (!tiendaId) {
                return res.status(400).json({ error: 'tiendaId es requerido' });
            }
            const stats = await citaService.obtenerDashboardStats(parseInt(tiendaId));
            res.json(stats);
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            res.status(500).json({ error: 'Error interno' });
        }
    }

    async getReporteCitas(req, res) {
        try {
            const { fechaInicio, fechaFin } = req.query;
            
            // Instanciamos el caso de uso con inyección de dependencias
            const useCase = new GenerarReporteCitas(citaRepository);
            const buffer = await useCase.execute(fechaInicio, fechaFin);

            res.setHeader(
                'Content-Type',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            );
            res.setHeader(
                'Content-Disposition',
                'attachment; filename=ReporteCitas.xlsx'
            );

            return res.send(buffer);
        } catch (error) {
            console.error('Error al generar el reporte:', error);
            return res.status(500).json({ error: 'Error interno al generar el reporte' });
        }
    }
}

module.exports = new ReporteController();

const GenerarReporteCitas = require('../../../application/usecases/generarReporteCitas');
const CitaRepository = require('../../../infraestructure/database/CitaRepositoryImpl');

const citaRepository = new CitaRepository();

class ReporteController {
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

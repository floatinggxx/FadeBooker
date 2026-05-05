const GenerarReporteCitas = require('../../application/usecases/GenerarReporteCitas');

class ReporteController {
    async getReporteCitas(req, res) {
        try {
            const { fechaInicio, fechaFin } = req.query;
            
            // Instanciamos el caso de uso (aquí se inyectaría el repo real)
            const generarReporteCitas = new GenerarReporteCitas();
            const buffer = await generarReporteCitas.execute(fechaInicio, fechaFin);

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

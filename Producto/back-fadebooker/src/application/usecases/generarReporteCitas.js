const ExcelJS = require('exceljs');

class GenerarReporteCitas {
    constructor(citaRepository) {
        this.citaRepository = citaRepository;
    }

    async execute(fechaInicio, fechaFin) {
        // En un escenario real, llamaríamos al repositorio:
        // const citas = await this.citaRepository.getByDateRange(fechaInicio, fechaFin);
        
        // Simulación de datos para el reporte
        const citas = [
            { id: 1, cliente: 'Juan Perez', barbero: 'Carlos Mendez', fecha: '2026-05-01', monto: 25.00 },
            { id: 2, cliente: 'Maria Garcia', barbero: 'Ana Lopez', fecha: '2026-05-02', monto: 35.00 },
            { id: 3, cliente: 'Luis Torres', barbero: 'Carlos Mendez', fecha: '2026-05-03', monto: 20.00 }
        ];

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Reporte de Citas');

        worksheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Cliente', key: 'cliente', width: 30 },
            { header: 'Barbero', key: 'barbero', width: 30 },
            { header: 'Fecha', key: 'fecha', width: 15 },
            { header: 'Monto', key: 'monto', width: 15, style: { numFmt: '"$"#,##0.00' } }
        ];

        // Estilo para el encabezado
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFE0E0E0' }
        };

        citas.forEach(cita => {
            worksheet.addRow(cita);
        });

        // Skill: document-processing (Generación de buffer para descarga)
        const buffer = await workbook.xlsx.writeBuffer();
        return buffer;
    }
}

module.exports = GenerarReporteCitas;

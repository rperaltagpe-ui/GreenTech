from pathlib import Path

BASE = Path(r'c:\GreeTech')

reports = {
    'Informe semanal de impacto.pdf': [
        'Greentech Amazon Systems',
        'Informe semanal de impacto',
        '',
        'Resumen de datos de la última semana en la región de Loreto e Iquitos.',
        'Incidentes de deforestación: 248 ha',
        'Tendencia: moderada; los patrullajes dron han aumentado la detección temprana.',
        'Recomendaciones: reforzar vigilancia en cuenca del río Nanay y sector I-12.'
    ],
    'Reporte de sensores.pdf': [
        'Greentech Amazon Systems',
        'Reporte de sensores',
        '',
        'Estado de la malla de sensores desplegada en Iquitos Norte.',
        'Sensores activos: 8,402',
        'Sensores con señal débil: 37',
        'Prioridad: reparar enlaces X-Alpha y revisar nodos de transmisión satelital.'
    ],
    'Resumen de alertas.pdf': [
        'Greentech Amazon Systems',
        'Resumen de alertas',
        '',
        'Informe consolidado de alertas críticas y advertencias para Loreto.',
        'Alertas recientes: 6',
        'Alerta crítica: 1 quema ilegal en sector I-12.',
        'Acción: despliegue de equipo de respuesta y patrullaje intensificado.'
    ]
}


def build_pdf(lines):
    objs = []
    lines_escaped = [line.replace('(', '\\(').replace(')', '\\)') for line in lines]
    stream_lines = ['BT /F1 18 Tf 72 %d Td (%s) Tj ET' % (760 - i * 36, text) for i, text in enumerate(lines_escaped)]
    stream = '\n'.join(stream_lines).encode('latin1')
    objs.append({'id': 1, 'data': b'<< /Type /Catalog /Pages 2 0 R >>'})
    objs.append({'id': 2, 'data': b'<< /Type /Pages /Kids [3 0 R] /Count 1 >>'})
    page = b'<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>'
    objs.append({'id': 3, 'data': page})
    objs.append({'id': 4, 'data': stream})
    objs.append({'id': 5, 'data': b'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'})

    body = b'%PDF-1.3\n%\xe2\xe3\xcf\xd3\n'
    xref = []
    offset = len(body)
    for obj in objs:
        xref.append(offset)
        body += f"{obj['id']} 0 obj\n".encode('latin1')
        if obj['id'] == 4:
            body += b'<< /Length %d >>\nstream\n' % len(stream)
            body += stream + b'\nendstream\n'
        else:
            body += obj['data'] + b'\n'
        body += b'endobj\n'
        offset = len(body)

    xref_start = len(body)
    body += b'xref\n0 %d\n0000000000 65535 f \n' % (len(objs) + 1)
    for off in xref:
        body += b'%010d 00000 n \n' % off
    body += b'trailer\n<< /Size %d /Root 1 0 R >>\nstartxref\n%d\n%%EOF\n' % (len(objs) + 1, xref_start)
    return body

for filename, lines in reports.items():
    output = BASE / filename
    with open(output, 'wb') as f:
        f.write(build_pdf(lines))
    print(f'Created {output}')

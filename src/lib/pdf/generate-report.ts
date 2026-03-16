import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

interface ReportData {
  companyName: string
  country: string
  countryCode: string
  industry: string
  naceCode: string
  headcount: number
  reportingYear: string
  scope1: number
  scope1Stationary: number
  scope1Fleet: number
  scope2Location: number
  scope2Market: number
  scope3: number
  total: number
  perEmployee: number
  monthlyData: {
    month: string
    scope1: number
    scope2: number
    scope3: number
    total: number
  }[]
  gridCountry: string
  gridLocation: number  // gCO2/kWh
  gridMarket: number    // gCO2/kWh
}

export type { ReportData }

export function generateGRIReport(data: ReportData): jsPDF {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  let y = 20

  // ── Header ──
  doc.setFillColor(59, 130, 246) // blue-500
  doc.rect(0, 0, pageWidth, 40, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('Hosmos ESG Report', 14, 20)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`GRI Standards 2021 · ${data.companyName} · ${data.reportingYear}`, 14, 32)

  y = 55
  doc.setTextColor(0, 0, 0)

  // ── Company Info ──
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('1. Organization Profile', 14, y)
  y += 10

  autoTable(doc, {
    startY: y,
    head: [['Parameter', 'Value']],
    body: [
      ['Company Name', data.companyName],
      ['Industry', data.industry],
      ['NACE Code', data.naceCode],
      ['Country', `${data.country} (${data.countryCode})`],
      ['Employees', String(data.headcount)],
      ['Reporting Year', data.reportingYear],
    ],
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] },
    margin: { left: 14, right: 14 },
    styles: { fontSize: 9 },
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 15

  // ── Emissions Summary ──
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('2. GHG Emissions Summary (tCO2e)', 14, y)
  y += 10

  autoTable(doc, {
    startY: y,
    head: [['Scope', 'Category', 'tCO2e', '% of Total']],
    body: [
      ['Scope 1', 'Stationary combustion', data.scope1Stationary.toFixed(2), ((data.scope1Stationary / data.total) * 100).toFixed(1) + '%'],
      ['Scope 1', 'Company fleet', data.scope1Fleet.toFixed(2), ((data.scope1Fleet / data.total) * 100).toFixed(1) + '%'],
      ['Scope 1', 'TOTAL', data.scope1.toFixed(2), ((data.scope1 / data.total) * 100).toFixed(1) + '%'],
      ['Scope 2', 'Location-based', data.scope2Location.toFixed(2), ((data.scope2Location / data.total) * 100).toFixed(1) + '%'],
      ['Scope 2', 'Market-based', data.scope2Market.toFixed(2), '—'],
      ['Scope 3', 'Business travel + commute', data.scope3.toFixed(2), ((data.scope3 / data.total) * 100).toFixed(1) + '%'],
      ['TOTAL', 'Scope 1 + 2 (loc) + 3', data.total.toFixed(2), '100%'],
    ],
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] },
    margin: { left: 14, right: 14 },
    styles: { fontSize: 9 },
    didParseCell: (hookData) => {
      // Bold the total rows
      if (hookData.row.index === 2 || hookData.row.index === 6) {
        hookData.cell.styles.fontStyle = 'bold'
      }
    },
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 15

  // ── KPI ──
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('3. Key Performance Indicators', 14, y)
  y += 10

  autoTable(doc, {
    startY: y,
    head: [['KPI', 'Value', 'Unit']],
    body: [
      ['Total Emissions', data.total.toFixed(2), 'tCO2e'],
      ['Emissions per Employee', data.perEmployee.toFixed(2), 'tCO2e/employee'],
      ['Grid Factor (location)', String(data.gridLocation), 'gCO2/kWh'],
      ['Grid Factor (market)', String(data.gridMarket), 'gCO2/kWh'],
      ['Scope 1 share', ((data.scope1 / data.total) * 100).toFixed(1), '%'],
      ['Scope 2 share', ((data.scope2Location / data.total) * 100).toFixed(1), '%'],
      ['Scope 3 share', ((data.scope3 / data.total) * 100).toFixed(1), '%'],
    ],
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] },
    margin: { left: 14, right: 14 },
    styles: { fontSize: 9 },
  })

  // ── Monthly Trend (new page) ──
  doc.addPage()
  y = 20

  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('4. Monthly Emissions Trend', 14, y)
  y += 10

  autoTable(doc, {
    startY: y,
    head: [['Month', 'Scope 1', 'Scope 2', 'Scope 3', 'Total']],
    body: data.monthlyData.map(m => [
      m.month,
      m.scope1.toFixed(2),
      m.scope2.toFixed(2),
      m.scope3.toFixed(2),
      m.total.toFixed(2),
    ]),
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] },
    margin: { left: 14, right: 14 },
    styles: { fontSize: 9 },
    foot: [['Annual Total',
      data.monthlyData.reduce((a, m) => a + m.scope1, 0).toFixed(2),
      data.monthlyData.reduce((a, m) => a + m.scope2, 0).toFixed(2),
      data.monthlyData.reduce((a, m) => a + m.scope3, 0).toFixed(2),
      data.monthlyData.reduce((a, m) => a + m.total, 0).toFixed(2),
    ]],
    footStyles: { fillColor: [243, 244, 246], textColor: [0, 0, 0], fontStyle: 'bold' },
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 15

  // ── Methodology ──
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('5. Methodology & Sources', 14, y)
  y += 8
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 100, 100)

  const methodology = [
    'GHG Protocol Corporate Standard (Scope 1, 2, 3)',
    'Scope 1: DEFRA/DESNZ Conversion Factors ' + data.reportingYear,
    'Scope 2: Dual reporting — location-based (production mix) and market-based (residual mix)',
    'Grid electricity factors: AIB European Residual Mix / EEA Production Mix ' + data.reportingYear,
    `Grid: ${data.gridCountry} — ${data.gridLocation} gCO2/kWh (location) / ${data.gridMarket} gCO2/kWh (market)`,
    'Scope 3: DEFRA factors for business travel (Cat. 6) and employee commuting (Cat. 7)',
    'GWP values: IPCC Fifth Assessment Report (AR5) — CO2, CH4, N2O',
    'All emission factors stored in auditable PostgreSQL database with full source traceability',
  ]

  methodology.forEach(line => {
    doc.text('• ' + line, 18, y)
    y += 5
  })

  // ── Footer on all pages ──
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(7)
    doc.setTextColor(180, 180, 180)
    doc.text(
      `Generated by Hosmos · ${new Date().toISOString().split('T')[0]} · Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    )
  }

  return doc
}

export function generateESRSReport(data: ReportData): jsPDF {
  // For now use same structure with ESRS header
  const doc = generateGRIReport(data)
  // Could customize further for ESRS E1 specific fields
  return doc
}

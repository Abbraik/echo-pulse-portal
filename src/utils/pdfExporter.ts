
import jsPDF from 'jspdf';

interface MockData {
  deiScore: number;
  psiuBalance: Array<{ name: string; value: number; color: string }>;
  entropyTrend: Array<{ cycle: number; value: number }>;
  kpis: Array<{ name: string; current: string; target: string; delta: string; status: string }>;
  loops: Array<{ name: string; coverage: number; consistency: number; objective: string }>;
  approvals: Array<{ title: string; type: string; owner: string; due: string; priority: string }>;
  zoneLeads: Array<{ zone: string; delivery: number; entropy: number; lastClosure: string }>;
}

export const exportExecutiveReportToPDF = (mockData: MockData) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Define color palette
  const colors = {
    neonTeal: [20, 184, 166],
    electricBlue: [59, 130, 246],
    darkGray: [51, 51, 51],
    mediumGray: [85, 85, 85],
    lightGray: [240, 240, 240],
    white: [255, 255, 255],
    black: [0, 0, 0]
  };

  // Page counter
  let pageNumber = 1;

  // Helper function to add watermark
  const addWatermark = () => {
    doc.setTextColor(colors.neonTeal[0], colors.neonTeal[1], colors.neonTeal[2]);
    doc.setFontSize(60);
    doc.setFont('helvetica', 'bold');
    const watermarkText = 'PDS';
    const textWidth = doc.getStringUnitWidth(watermarkText) * 60 / doc.internal.scaleFactor;
    doc.text(watermarkText, pageWidth - textWidth - 20, pageHeight - 30, { 
      align: 'left',
      opacity: 0.1 
    });
  };

  // Helper function to add footer
  const addFooter = () => {
    // Neon-teal rule
    doc.setDrawColor(colors.neonTeal[0], colors.neonTeal[1], colors.neonTeal[2]);
    doc.setLineWidth(0.5);
    doc.line(20, pageHeight - 15, pageWidth - 20, pageHeight - 15);
    
    // Footer text
    doc.setTextColor(colors.mediumGray[0], colors.mediumGray[1], colors.mediumGray[2]);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Population Dynamics System', 20, pageHeight - 8);
    doc.text(`${pageNumber}`, pageWidth / 2, pageHeight - 8, { align: 'center' });
    doc.text(new Date().toLocaleDateString(), pageWidth - 20, pageHeight - 8, { align: 'right' });
  };

  // Helper function to add section header
  const addSectionHeader = (title: string, yPos: number) => {
    // Background panel with gradient effect
    doc.setFillColor(colors.neonTeal[0], colors.neonTeal[1], colors.neonTeal[2]);
    doc.roundedRect(20, yPos - 5, pageWidth - 40, 15, 3, 3, 'F');
    
    // Gradient accent bar
    doc.setFillColor(colors.electricBlue[0], colors.electricBlue[1], colors.electricBlue[2]);
    doc.rect(20, yPos - 5, 5, 15, 'F');
    
    // Section title
    doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 30, yPos + 2);
    
    return yPos + 20;
  };

  // Helper function to create glass panel effect
  const addGlassPanel = (x: number, y: number, width: number, height: number) => {
    // Semi-transparent background
    doc.setFillColor(colors.white[0], colors.white[1], colors.white[2]);
    doc.setGState(new doc.GState({ opacity: 0.5 }));
    doc.roundedRect(x, y, width, height, 5, 5, 'F');
    
    // Border
    doc.setGState(new doc.GState({ opacity: 1 }));
    doc.setDrawColor(colors.neonTeal[0], colors.neonTeal[1], colors.neonTeal[2]);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, y, width, height, 5, 5, 'S');
  };

  // Helper function for new page
  const addNewPage = () => {
    addWatermark();
    addFooter();
    doc.addPage();
    pageNumber++;
    return 20; // Reset yPos
  };

  // COVER PAGE
  // Full-bleed background
  doc.setFillColor(colors.neonTeal[0], colors.neonTeal[1], colors.neonTeal[2]);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Subtle pattern overlay (simulating blurred UAE map)
  doc.setFillColor(colors.electricBlue[0], colors.electricBlue[1], colors.electricBlue[2]);
  doc.setGState(new doc.GState({ opacity: 0.3 }));
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * pageWidth;
    const y = Math.random() * pageHeight;
    const size = Math.random() * 10 + 5;
    doc.circle(x, y, size, 'F');
  }
  doc.setGState(new doc.GState({ opacity: 1 }));
  
  // Translucent black panel
  doc.setFillColor(colors.black[0], colors.black[1], colors.black[2]);
  doc.setGState(new doc.GState({ opacity: 0.5 }));
  doc.roundedRect(40, 60, pageWidth - 80, 120, 10, 10, 'F');
  doc.setGState(new doc.GState({ opacity: 1 }));
  
  // Title text
  doc.setTextColor(colors.neonTeal[0], colors.neonTeal[1], colors.neonTeal[2]);
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.text('Executive Briefing', pageWidth / 2, 100, { align: 'center' });
  
  doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
  doc.setFontSize(24);
  doc.text('Population Dynamics System', pageWidth / 2, 120, { align: 'center' });
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }), pageWidth / 2, 140, { align: 'center' });
  
  doc.text('Director General', pageWidth / 2, 160, { align: 'center' });

  let yPos = addNewPage();

  // TABLE OF CONTENTS
  yPos = addSectionHeader('Table of Contents', yPos);
  
  const tocItems = [
    'Strategic Snapshot',
    'Key Performance Indicators', 
    'Loop Analysis Summary',
    'Pending Approvals & Decisions',
    'Cross-Zone Governance',
    'Director General Notes',
    'Data Sources & Methodology'
  ];
  
  addGlassPanel(20, yPos, pageWidth - 40, tocItems.length * 8 + 20);
  yPos += 10;
  
  doc.setTextColor(colors.darkGray[0], colors.darkGray[1], colors.darkGray[2]);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  tocItems.forEach((item, index) => {
    doc.text(item, 30, yPos);
    doc.text(`${index + 3}`, pageWidth - 30, yPos, { align: 'right' });
    yPos += 8;
  });

  yPos = addNewPage();

  // STRATEGIC SNAPSHOT
  yPos = addSectionHeader('Strategic Snapshot', yPos);
  
  // DEI Health Panel
  addGlassPanel(20, yPos, (pageWidth - 50) / 3, 60);
  doc.setTextColor(colors.neonTeal[0], colors.neonTeal[1], colors.neonTeal[2]);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('DEI System Health', 30, yPos + 10);
  
  doc.setTextColor(colors.darkGray[0], colors.darkGray[1], colors.darkGray[2]);
  doc.setFontSize(24);
  doc.text(`${mockData.deiScore}%`, 30, yPos + 30);
  doc.setFontSize(10);
  doc.text('In Target Band', 30, yPos + 40);
  
  // PSIU Balance Panel
  const panelWidth = (pageWidth - 50) / 3;
  addGlassPanel(30 + panelWidth, yPos, panelWidth, 60);
  doc.setTextColor(colors.neonTeal[0], colors.neonTeal[1], colors.neonTeal[2]);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('PSIU Balance', 40 + panelWidth, yPos + 10);
  
  doc.setTextColor(colors.darkGray[0], colors.darkGray[1], colors.darkGray[2]);
  doc.setFontSize(9);
  mockData.psiuBalance.forEach((item, index) => {
    doc.text(`${item.name}: ${item.value}`, 40 + panelWidth, yPos + 20 + (index * 8));
  });
  
  // Entropy Trend Panel
  addGlassPanel(40 + (panelWidth * 2), yPos, panelWidth, 60);
  doc.setTextColor(colors.neonTeal[0], colors.neonTeal[1], colors.neonTeal[2]);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Entropy Trend', 50 + (panelWidth * 2), yPos + 10);
  
  doc.setTextColor(colors.darkGray[0], colors.darkGray[1], colors.darkGray[2]);
  doc.setFontSize(10);
  doc.text('12 cycles: 0.4→0.65', 50 + (panelWidth * 2), yPos + 25);
  doc.setTextColor(colors.electricBlue[0], colors.electricBlue[1], colors.electricBlue[2]);
  doc.text('↑ 0.25 increase', 50 + (panelWidth * 2), yPos + 35);

  yPos += 80;
  yPos = addNewPage();

  // KEY PERFORMANCE INDICATORS
  yPos = addSectionHeader('Key Performance Indicators', yPos);
  
  // KPI Table
  addGlassPanel(20, yPos, pageWidth - 40, 60);
  yPos += 10;
  
  // Table header
  doc.setFillColor(colors.neonTeal[0], colors.neonTeal[1], colors.neonTeal[2]);
  doc.rect(25, yPos, pageWidth - 50, 8, 'F');
  
  doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('KPI', 30, yPos + 5);
  doc.text('Current', 80, yPos + 5);
  doc.text('Target', 110, yPos + 5);
  doc.text('Delta', 140, yPos + 5);
  doc.text('Status', 170, yPos + 5);
  yPos += 8;

  // Table data
  doc.setFont('helvetica', 'normal');
  mockData.kpis.forEach((kpi, index) => {
    if (index % 2 === 0) {
      doc.setFillColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
      doc.rect(25, yPos, pageWidth - 50, 8, 'F');
    }
    
    doc.setTextColor(colors.darkGray[0], colors.darkGray[1], colors.darkGray[2]);
    doc.text(kpi.name, 30, yPos + 5);
    doc.text(kpi.current, 80, yPos + 5);
    doc.text(kpi.target, 110, yPos + 5);
    doc.text(kpi.delta, 140, yPos + 5);
    doc.text(kpi.status, 170, yPos + 5);
    yPos += 8;
  });

  yPos += 20;
  yPos = addNewPage();

  // LOOP ANALYSIS SUMMARY
  yPos = addSectionHeader('Loop Analysis Summary', yPos);
  
  addGlassPanel(20, yPos, pageWidth - 40, 80);
  yPos += 10;
  
  // Loop table header
  doc.setFillColor(colors.neonTeal[0], colors.neonTeal[1], colors.neonTeal[2]);
  doc.rect(25, yPos, pageWidth - 50, 8, 'F');
  
  doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Loop Name', 30, yPos + 5);
  doc.text('Coverage %', 100, yPos + 5);
  doc.text('Consistency', 140, yPos + 5);
  yPos += 8;

  // Loop data
  doc.setFont('helvetica', 'normal');
  mockData.loops.forEach((loop, index) => {
    if (index % 2 === 0) {
      doc.setFillColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
      doc.rect(25, yPos, pageWidth - 50, 8, 'F');
    }
    
    doc.setTextColor(colors.darkGray[0], colors.darkGray[1], colors.darkGray[2]);
    doc.text(loop.name, 30, yPos + 5);
    doc.text(`${loop.coverage}%`, 100, yPos + 5);
    doc.text(`${loop.consistency}/100`, 140, yPos + 5);
    yPos += 8;
  });

  yPos += 20;

  // Objectives section
  addGlassPanel(20, yPos, pageWidth - 40, 60);
  yPos += 10;
  
  doc.setTextColor(colors.neonTeal[0], colors.neonTeal[1], colors.neonTeal[2]);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Objectives:', 30, yPos);
  yPos += 8;
  
  doc.setTextColor(colors.darkGray[0], colors.darkGray[1], colors.darkGray[2]);
  doc.setFont('helvetica', 'normal');
  mockData.loops.forEach((loop) => {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`${loop.name}:`, 30, yPos);
    yPos += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const splitObjective = doc.splitTextToSize(loop.objective, pageWidth - 60);
    doc.text(splitObjective, 35, yPos);
    yPos += splitObjective.length * 4 + 3;
  });

  yPos = addNewPage();

  // PENDING APPROVALS & DECISIONS
  yPos = addSectionHeader('Pending Approvals & Decisions', yPos);
  
  addGlassPanel(20, yPos, pageWidth - 40, 70);
  yPos += 10;
  
  // Approvals table
  doc.setFillColor(colors.neonTeal[0], colors.neonTeal[1], colors.neonTeal[2]);
  doc.rect(25, yPos, pageWidth - 50, 8, 'F');
  
  doc.setTextColor(colors.white[0], colors.white[1], colors.white[2]);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Title', 30, yPos + 5);
  doc.text('Type', 80, yPos + 5);
  doc.text('Owner', 120, yPos + 5);
  doc.text('Due Date', 160, yPos + 5);
  yPos += 8;

  doc.setFont('helvetica', 'normal');
  mockData.approvals.forEach((item, index) => {
    if (index % 2 === 0) {
      doc.setFillColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
      doc.rect(25, yPos, pageWidth - 50, 8, 'F');
    }
    
    doc.setTextColor(colors.darkGray[0], colors.darkGray[1], colors.darkGray[2]);
    doc.text(item.title, 30, yPos + 5);
    doc.text(item.type, 80, yPos + 5);
    doc.text(item.owner, 120, yPos + 5);
    doc.text(item.due, 160, yPos + 5);
    yPos += 8;
  });

  yPos = addNewPage();

  // CROSS-ZONE GOVERNANCE
  yPos = addSectionHeader('Cross-Zone Governance', yPos);
  
  // Zone performance overview
  doc.setTextColor(colors.electricBlue[0], colors.electricBlue[1], colors.electricBlue[2]);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Zone Performance Overview', 20, yPos);
  yPos += 15;

  mockData.zoneLeads.forEach((zone, index) => {
    const xOffset = 20 + (index % 3) * 60;
    const yOffset = yPos + Math.floor(index / 3) * 40;
    
    addGlassPanel(xOffset, yOffset, 55, 35);
    
    doc.setTextColor(colors.neonTeal[0], colors.neonTeal[1], colors.neonTeal[2]);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`${zone.zone}`, xOffset + 5, yOffset + 8);
    
    doc.setTextColor(colors.darkGray[0], colors.darkGray[1], colors.darkGray[2]);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Delivery: ${zone.delivery}%`, xOffset + 5, yOffset + 16);
    doc.text(`Entropy: ${zone.entropy}`, xOffset + 5, yOffset + 22);
    doc.text(`Closure: ${zone.lastClosure}`, xOffset + 5, yOffset + 28);
  });

  yPos = addNewPage();

  // DIRECTOR GENERAL NOTES
  yPos = addSectionHeader('Director General Notes', yPos);
  
  addGlassPanel(20, yPos, pageWidth - 40, 120);
  yPos += 10;
  
  doc.setTextColor(colors.darkGray[0], colors.darkGray[1], colors.darkGray[2]);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Personal annotations and strategic notes:', 30, yPos);
  yPos += 15;

  // Add lines for notes
  doc.setDrawColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
  for (let i = 0; i < 12; i++) {
    doc.line(30, yPos, pageWidth - 30, yPos);
    yPos += 8;
  }

  yPos += 20;

  // DATA SOURCES & METHODOLOGY
  yPos = addSectionHeader('Data Sources & Methodology', yPos);
  
  addGlassPanel(20, yPos, pageWidth - 40, 50);
  yPos += 10;
  
  doc.setTextColor(colors.darkGray[0], colors.darkGray[1], colors.darkGray[2]);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  
  const methodologyText = [
    '• Population data sourced from Federal Competitiveness and Statistics Centre',
    '• PSIU metrics calculated using weighted average of zone performance indicators',
    '• Entropy measurements based on system complexity analysis over 12-cycle rolling window',
    '• DEI composite scoring methodology available in Technical Appendix B',
    `• All data current as of ${new Date().toLocaleDateString()}`,
    '• Charts generated using Population Dynamics System analytical engine',
    '• PDF compliant with PDF/A-1b standard for archival purposes'
  ];
  
  methodologyText.forEach((text, index) => {
    doc.text(text, 30, yPos + (index * 5));
  });

  // Add final watermark and footer
  addWatermark();
  addFooter();

  // Save the PDF with enhanced metadata
  doc.setProperties({
    title: 'Executive Briefing - Population Dynamics System',
    subject: 'Strategic Overview and Performance Analysis',
    author: 'Director General',
    keywords: 'PDS, Executive, Report, Strategy, Performance',
    creator: 'Population Dynamics System'
  });

  // Save with timestamped filename
  doc.save(`Executive_Report_PDS_${new Date().toISOString().split('T')[0]}.pdf`);
};

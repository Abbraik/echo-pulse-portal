
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
  let yPos = 20;

  // Helper function to add a new page if needed
  const checkPageBreak = (requiredSpace: number) => {
    if (yPos + requiredSpace > pageHeight - 20) {
      doc.addPage();
      yPos = 20;
    }
  };

  // Cover Page
  doc.setFillColor(20, 184, 166); // Teal color
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.text('Executive Briefing', pageWidth / 2, 80, { align: 'center' });
  
  doc.setFontSize(24);
  doc.text('Population Dynamics System', pageWidth / 2, 100, { align: 'center' });
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }), pageWidth / 2, 120, { align: 'center' });
  
  doc.text('Director General', pageWidth / 2, 140, { align: 'center' });

  // Strategic Snapshot Page
  doc.addPage();
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  yPos = 20;
  doc.setTextColor(20, 184, 166);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Strategic Snapshot', 20, yPos);
  yPos += 20;

  // DEI Health
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('DEI System Health', 20, yPos);
  yPos += 10;
  
  doc.setFont('helvetica', 'normal');
  doc.text(`Current Score: ${mockData.deiScore}%`, 20, yPos);
  doc.text('Status: In Target Band', 20, yPos + 10);
  yPos += 30;

  // PSIU Balance
  doc.setFont('helvetica', 'bold');
  doc.text('PSIU Balance', 20, yPos);
  yPos += 10;
  
  doc.setFont('helvetica', 'normal');
  mockData.psiuBalance.forEach((item, index) => {
    doc.text(`${item.name}: ${item.value}`, 20, yPos + (index * 8));
  });
  yPos += 50;

  // Key KPIs Page
  checkPageBreak(80);
  doc.setTextColor(20, 184, 166);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Key Performance Indicators', 20, yPos);
  yPos += 20;

  // KPI Table Headers
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('KPI', 20, yPos);
  doc.text('Current', 80, yPos);
  doc.text('Target', 110, yPos);
  doc.text('Delta', 140, yPos);
  doc.text('Status', 170, yPos);
  yPos += 10;

  // KPI Table Data
  doc.setFont('helvetica', 'normal');
  mockData.kpis.forEach((kpi, index) => {
    const bgColor = index % 2 === 0 ? [240, 240, 240] : [255, 255, 255];
    doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
    doc.rect(15, yPos - 5, pageWidth - 30, 8, 'F');
    
    doc.text(kpi.name, 20, yPos);
    doc.text(kpi.current, 80, yPos);
    doc.text(kpi.target, 110, yPos);
    doc.text(kpi.delta, 140, yPos);
    doc.text(kpi.status, 170, yPos);
    yPos += 10;
  });
  yPos += 20;

  // Loop Analysis Page
  checkPageBreak(60);
  doc.setTextColor(20, 184, 166);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Loop Analysis Summary', 20, yPos);
  yPos += 20;

  // Loop Table Headers
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Loop Name', 20, yPos);
  doc.text('Coverage %', 80, yPos);
  doc.text('Consistency', 120, yPos);
  yPos += 10;

  // Loop Table Data
  doc.setFont('helvetica', 'normal');
  mockData.loops.forEach((loop, index) => {
    const bgColor = index % 2 === 0 ? [240, 240, 240] : [255, 255, 255];
    doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
    doc.rect(15, yPos - 5, pageWidth - 30, 8, 'F');
    
    doc.text(loop.name, 20, yPos);
    doc.text(`${loop.coverage}%`, 80, yPos);
    doc.text(`${loop.consistency}/100`, 120, yPos);
    yPos += 10;
  });
  yPos += 20;

  // Objectives
  doc.setFont('helvetica', 'bold');
  doc.text('Objectives:', 20, yPos);
  yPos += 10;
  
  doc.setFont('helvetica', 'normal');
  mockData.loops.forEach((loop, index) => {
    doc.text(`${loop.name}:`, 20, yPos);
    yPos += 8;
    const splitObjective = doc.splitTextToSize(loop.objective, pageWidth - 40);
    doc.text(splitObjective, 25, yPos);
    yPos += splitObjective.length * 5 + 5;
  });

  // Approvals & Decisions Page
  doc.addPage();
  yPos = 20;
  doc.setTextColor(20, 184, 166);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Pending Approvals & Decisions', 20, yPos);
  yPos += 20;

  // Approvals Table
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Title', 20, yPos);
  doc.text('Type', 80, yPos);
  doc.text('Owner', 120, yPos);
  doc.text('Due Date', 160, yPos);
  yPos += 10;

  doc.setFont('helvetica', 'normal');
  mockData.approvals.forEach((item, index) => {
    const bgColor = index % 2 === 0 ? [240, 240, 240] : [255, 255, 255];
    doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
    doc.rect(15, yPos - 5, pageWidth - 30, 8, 'F');
    
    doc.text(item.title, 20, yPos);
    doc.text(item.type, 80, yPos);
    doc.text(item.owner, 120, yPos);
    doc.text(item.due, 160, yPos);
    yPos += 10;
  });

  // Cross-Zone Governance Page
  doc.addPage();
  yPos = 20;
  doc.setTextColor(20, 184, 166);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Cross-Zone Governance', 20, yPos);
  yPos += 20;

  // Zone Leads
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Zone Performance Overview', 20, yPos);
  yPos += 15;

  mockData.zoneLeads.forEach((zone, index) => {
    doc.setFont('helvetica', 'bold');
    doc.text(`${zone.zone} Zone`, 20, yPos);
    yPos += 8;
    
    doc.setFont('helvetica', 'normal');
    doc.text(`Delivery: ${zone.delivery}%`, 25, yPos);
    doc.text(`Entropy: ${zone.entropy}`, 25, yPos + 6);
    doc.text(`Last Closure: ${zone.lastClosure}`, 25, yPos + 12);
    yPos += 25;
  });

  // Notes Page
  doc.addPage();
  yPos = 20;
  doc.setTextColor(20, 184, 166);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Director General Notes', 20, yPos);
  yPos += 20;

  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.text('Personal annotations and strategic notes:', 20, yPos);
  yPos += 20;

  // Add lines for notes
  for (let i = 0; i < 15; i++) {
    doc.line(20, yPos, pageWidth - 20, yPos);
    yPos += 10;
  }

  // Footer with metadata
  yPos = pageHeight - 30;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('Data Sources & Methodology:', 20, yPos);
  yPos += 5;
  doc.text('• Population data sourced from Federal Competitiveness and Statistics Centre', 20, yPos);
  yPos += 4;
  doc.text('• PSIU metrics calculated using weighted average of zone performance indicators', 20, yPos);
  yPos += 4;
  doc.text('• Entropy measurements based on system complexity analysis over 12-cycle rolling window', 20, yPos);
  yPos += 4;
  doc.text(`• All data current as of ${new Date().toLocaleDateString()}`, 20, yPos);

  // Save the PDF
  doc.save(`Executive_Report_${new Date().toISOString().split('T')[0]}.pdf`);
};

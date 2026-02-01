#!/usr/bin/env python3
"""
Convert PROJECT_DOCUMENTATION.md to professional PDF
Uses reportlab for PDF generation with styling
"""

import os
import sys
from pathlib import Path

# Try to install required packages if not available
try:
    from reportlab.lib.pagesizes import letter, A4
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import inch
    from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY, TA_RIGHT
    from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak, KeepTogether
    from reportlab.lib import colors
    from reportlab.pdfgen import canvas
except ImportError:
    print("Installing required packages...")
    os.system("pip install reportlab markdown2")
    from reportlab.lib.pagesizes import letter, A4
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.units import inch
    from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY, TA_RIGHT
    from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak, KeepTogether
    from reportlab.lib import colors
    from reportlab.pdfgen import canvas

def create_custom_styles():
    """Create custom styles for the PDF"""
    styles = getSampleStyleSheet()
    
    # Define color palette
    primary_blue = colors.HexColor('#0f3366')
    accent_teal = colors.HexColor('#14b8a6')
    text_dark = colors.HexColor('#1f2937')
    text_light = colors.HexColor('#6b7280')
    
    # Title style
    styles.add(ParagraphStyle(
        name='CustomTitle',
        parent=styles['Heading1'],
        fontSize=28,
        textColor=primary_blue,
        spaceAfter=12,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    ))
    
    # Subtitle style
    styles.add(ParagraphStyle(
        name='CustomSubtitle',
        parent=styles['Heading2'],
        fontSize=18,
        textColor=accent_teal,
        spaceAfter=10,
        spaceBefore=10,
        fontName='Helvetica-Bold'
    ))
    
    # Section heading
    styles.add(ParagraphStyle(
        name='SectionHead',
        parent=styles['Heading2'],
        fontSize=14,
        textColor=primary_blue,
        spaceAfter=8,
        spaceBefore=8,
        fontName='Helvetica-Bold',
        borderColor=accent_teal,
        borderWidth=1,
        borderPadding=5
    ))
    
    # Body text
    styles.add(ParagraphStyle(
        name='CustomBody',
        parent=styles['BodyText'],
        fontSize=10,
        textColor=text_dark,
        alignment=TA_JUSTIFY,
        spaceAfter=6
    ))
    
    # Code style
    styles.add(ParagraphStyle(
        name='CodeBlock',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8,
        textColor=colors.HexColor('#374151'),
        backColor=colors.HexColor('#f3f4f6'),
        leftIndent=10,
        rightIndent=10,
        spaceAfter=6
    ))
    
    return styles

def markdown_to_pdf(input_file, output_file):
    """Convert markdown documentation to PDF"""
    
    # Read markdown file
    if not os.path.exists(input_file):
        print(f"Error: File {input_file} not found")
        return False
    
    with open(input_file, 'r', encoding='utf-8') as f:
        markdown_content = f.read()
    
    # Create PDF document
    doc = SimpleDocTemplate(
        output_file,
        pagesize=letter,
        rightMargin=0.75*inch,
        leftMargin=0.75*inch,
        topMargin=0.75*inch,
        bottomMargin=0.75*inch,
        title="Chemical Equipment Visualizer - Professional Documentation"
    )
    
    styles = create_custom_styles()
    story = []
    
    # Parse markdown and build story
    lines = markdown_content.split('\n')
    
    # Add title page
    story.append(Spacer(1, 1.5*inch))
    story.append(Paragraph("Chemical Equipment Visualizer", styles['CustomTitle']))
    story.append(Spacer(1, 0.2*inch))
    story.append(Paragraph("Professional Project Documentation", styles['CustomSubtitle']))
    story.append(Spacer(1, 0.2*inch))
    story.append(Paragraph("Version 2.0 | February 2026", styles['Normal']))
    story.append(Spacer(1, 2*inch))
    
    # Add document info
    info_data = [
        ['Status:', 'Production Ready'],
        ['Client Deliverable:', 'Yes'],
        ['Last Updated:', 'February 1, 2026'],
    ]
    
    info_table = Table(info_data, colWidths=[2*inch, 4*inch])
    info_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f3f4f6')),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.HexColor('#1f2937')),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e5e7eb')),
    ]))
    
    story.append(info_table)
    story.append(PageBreak())
    
    # Table of Contents
    story.append(Paragraph("Table of Contents", styles['CustomSubtitle']))
    story.append(Spacer(1, 0.2*inch))
    
    toc_items = [
        "1. Executive Summary",
        "2. Project Overview",
        "3. Architecture & Technology Stack",
        "4. Features & Capabilities",
        "5. System Requirements",
        "6. Installation & Setup",
        "7. User Guide",
        "8. API Documentation",
        "9. Database Schema",
        "10. Authentication System",
        "11. Data Management",
        "12. UI/UX Design System",
        "13. Performance & Optimization",
        "14. Security Considerations",
        "15. Maintenance & Support",
        "16. Troubleshooting Guide",
        "17. Future Enhancements",
    ]
    
    for item in toc_items:
        story.append(Paragraph(item, styles['Normal']))
    
    story.append(PageBreak())
    
    # Process content sections
    current_section = []
    in_code_block = False
    
    for line in lines:
        if line.startswith('# ') and not line.startswith('##'):
            # Main section
            if current_section:
                story.extend(current_section)
                current_section = []
            
            section_title = line.replace('# ', '').strip()
            if section_title and section_title != 'Chemical Equipment Visualizer':
                story.append(PageBreak())
                story.append(Paragraph(section_title, styles['CustomSubtitle']))
                story.append(Spacer(1, 0.1*inch))
        
        elif line.startswith('## '):
            # Subsection
            subsection_title = line.replace('## ', '').strip()
            if subsection_title:
                current_section.append(Paragraph(subsection_title, styles['SectionHead']))
                current_section.append(Spacer(1, 0.1*inch))
        
        elif line.startswith('```'):
            # Code block
            in_code_block = not in_code_block
        
        elif line.strip().startswith('|') and '|' in line:
            # Table
            if current_section:
                story.extend(current_section)
                current_section = []
            
            # Simple table handling
            current_section.append(Spacer(1, 0.1*inch))
        
        elif line.strip() == '':
            # Empty line
            current_section.append(Spacer(1, 0.05*inch))
        
        elif in_code_block:
            # Code content
            current_section.append(Paragraph(line.strip(), styles['CodeBlock']))
        
        else:
            # Regular text
            if line.strip():
                text = line.strip().replace('**', '<b>').replace('**', '</b>')
                text = text.replace('`', '<font face="Courier" size="9">')
                current_section.append(Paragraph(text, styles['CustomBody']))
    
    # Add remaining content
    if current_section:
        story.extend(current_section)
    
    # Add footer section
    story.append(PageBreak())
    story.append(Paragraph("Document Control", styles['CustomSubtitle']))
    story.append(Spacer(1, 0.1*inch))
    
    footer_data = [
        ['Version', 'Date', 'Author', 'Changes'],
        ['1.0', 'Jan 2026', 'Development Team', 'Initial documentation'],
        ['2.0', 'Feb 2026', 'Development Team', 'Added Auth, PDF charts, complete feature set'],
    ]
    
    footer_table = Table(footer_data, colWidths=[1*inch, 1.2*inch, 1.5*inch, 2*inch])
    footer_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0f3366')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e5e7eb')),
    ]))
    
    story.append(footer_table)
    
    # Build PDF
    try:
        doc.build(story)
        print(f"✅ PDF successfully created: {output_file}")
        return True
    except Exception as e:
        print(f"❌ Error creating PDF: {e}")
        return False

if __name__ == '__main__':
    project_dir = Path(__file__).parent
    md_file = project_dir / 'PROJECT_DOCUMENTATION.md'
    pdf_file = project_dir / 'PROJECT_DOCUMENTATION.pdf'
    
    print(f"Converting {md_file} to PDF...")
    success = markdown_to_pdf(str(md_file), str(pdf_file))
    
    if success:
        print(f"\n📄 PDF file created at: {pdf_file}")
        print(f"File size: {os.path.getsize(pdf_file) / 1024:.2f} KB")
    else:
        sys.exit(1)
